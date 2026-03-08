import { Request, Response } from 'express';
import axios from 'axios';

const BASE_URL = 'https://reelshort.com';
const API_BASE = 'https://api.reelshort.com';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': BASE_URL,
    'Origin': BASE_URL,
};

export async function reelshortSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const page = parseInt(req.query.page as string) || 1;

    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/drama/search`, {
            params: { keyword: q, page, size: 20 },
            headers,
            timeout: 15000,
        });

        const list = data?.data?.list || data?.data || data?.result || [];
        const results = list.map((item: any) => ({
            id: item.dramaId || item.id || item.seriesId,
            title: item.dramaName || item.title || item.seriesName,
            cover: item.cover || item.coverUrl || item.poster,
            description: item.introduce || item.description || item.intro || '',
            episodes: item.totalEpisode || item.episodeCount || 0,
            status: item.isFinished || item.isCompleted ? 'Completed' : 'Ongoing',
            tags: item.tagList || item.tags || item.categories || [],
            platform: 'ReelShort',
        }));

        res.json({ status: true, page, total: results.length, result: results });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export async function reelshortDetail(req: Request, res: Response) {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/drama/detail`, {
            params: { dramaId: id },
            headers,
            timeout: 15000,
        });

        const item = data?.data;
        if (!item) throw new Error('Drama tidak ditemukan.');

        res.json({
            status: true,
            result: {
                id: item.dramaId || item.id,
                title: item.dramaName || item.title,
                cover: item.cover || item.coverUrl,
                description: item.introduce || item.description,
                episodes: item.totalEpisode || item.episodeCount,
                status: item.isFinished ? 'Completed' : 'Ongoing',
                tags: item.tagList || [],
                actors: item.actorList || [],
                platform: 'ReelShort',
                url: `${BASE_URL}/drama/${id}`,
            },
        });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export async function reelshortStream(req: Request, res: Response) {
    const id = req.query.id as string;
    const episode = req.query.ep as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/drama/episode/list`, {
            params: { dramaId: id, episode: episode ? parseInt(episode) : undefined },
            headers,
            timeout: 15000,
        });

        const list = data?.data?.list || data?.data || [];
        const episodes = list.map((ep: any) => ({
            episode: ep.episode || ep.episodeNo,
            title: ep.title || ep.episodeName || `Episode ${ep.episode}`,
            duration: ep.duration || null,
            videoUrl: ep.videoUrl || ep.playUrl || ep.url || null,
            thumbnail: ep.cover || ep.thumbnail || null,
            isFree: ep.isFree !== false,
        }));

        res.json({ status: true, dramaId: id, total: episodes.length, result: episodes });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export default async function reelshortHandler(req: Request, res: Response) {
    const action = (req.query.action as string) || 'search';
    if (action === 'detail') return reelshortDetail(req, res);
    if (action === 'stream') return reelshortStream(req, res);
    return reelshortSearch(req, res);
}
