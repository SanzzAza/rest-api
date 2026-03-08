import { Request, Response } from 'express';
import axios from 'axios';

const BASE_URL = 'https://www.melolo.co';
const API_BASE = 'https://api.melolo.co';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json',
    'Referer': BASE_URL,
    'Origin': BASE_URL,
};

export async function melloloSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const page = parseInt(req.query.page as string) || 1;
    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/v1/search`, {
            params: { keyword: q, page, pageSize: 20 },
            headers,
            timeout: 15000,
        });

        const list = data?.data?.list || data?.data || [];
        const results = list.map((item: any) => ({
            id: item.id || item.dramaId,
            title: item.title || item.dramaName,
            cover: item.cover || item.coverUrl,
            description: item.description || item.introduce || '',
            episodes: item.totalEpisode || item.episodeCount || 0,
            status: item.isCompleted ? 'Completed' : 'Ongoing',
            tags: item.tags || item.tagList || [],
            platform: 'Melolo',
        }));

        res.json({ status: true, page, total: results.length, result: results });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export async function melloloDetail(req: Request, res: Response) {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/v1/drama/${id}`, { headers, timeout: 15000 });
        const item = data?.data;
        if (!item) throw new Error('Drama tidak ditemukan.');

        res.json({
            status: true,
            result: {
                id: item.id,
                title: item.title || item.dramaName,
                cover: item.cover || item.coverUrl,
                description: item.description || item.introduce,
                episodes: item.totalEpisode || item.episodeCount,
                status: item.isCompleted ? 'Completed' : 'Ongoing',
                tags: item.tags || [],
                actors: item.actors || item.actorList || [],
                platform: 'Melolo',
                url: `${BASE_URL}/drama/${id}`,
            },
        });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export async function melloloStream(req: Request, res: Response) {
    const id = req.query.id as string;
    const episode = req.query.ep as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/v1/drama/${id}/episodes`, {
            params: { episode: episode ? parseInt(episode) : undefined },
            headers,
            timeout: 15000,
        });

        const list = data?.data?.list || data?.data || [];
        const episodes = list.map((ep: any) => ({
            episode: ep.episode || ep.episodeNo,
            title: ep.title || `Episode ${ep.episode}`,
            duration: ep.duration || null,
            videoUrl: ep.videoUrl || ep.playUrl || null,
            thumbnail: ep.cover || ep.thumbnail || null,
            isFree: ep.isFree !== false,
        }));

        res.json({ status: true, dramaId: id, total: episodes.length, result: episodes });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export default async function melloloHandler(req: Request, res: Response) {
    const action = (req.query.action as string) || 'search';
    if (action === 'detail') return melloloDetail(req, res);
    if (action === 'stream') return melloloStream(req, res);
    return melloloSearch(req, res);
}
