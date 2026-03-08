import { Request, Response } from 'express';
import axios from 'axios';

const BASE_URL = 'https://dramabox.com';
const API_BASE = 'https://api.dramaboxapp.com';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': BASE_URL,
    'Origin': BASE_URL,
};

// Search DramaBox
export async function dramaboxSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const page = parseInt(req.query.page as string) || 1;

    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/v1/drama/search`, {
            params: { keyword: q, page, pageSize: 20 },
            headers,
            timeout: 15000,
        });

        const list = data?.data?.list || data?.data || [];
        const results = list.map((item: any) => ({
            id: item.dramaId || item.id,
            title: item.dramaName || item.name || item.title,
            cover: item.cover || item.coverUrl || item.poster,
            description: item.introduce || item.description || '',
            episodes: item.totalEpisode || item.episodeCount || 0,
            status: item.updateStatus === 1 ? 'Ongoing' : 'Completed',
            tags: item.tagList || item.tags || [],
            rating: item.score || item.rating || null,
            platform: 'DramaBox',
        }));

        res.json({ status: true, page, total: results.length, result: results });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

// Detail DramaBox
export async function dramaboxDetail(req: Request, res: Response) {
    const id = (req.query.id) as string;

    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

    try {
        const { data } = await axios.get(`${API_BASE}/api/v1/drama/detail`, {
            params: { dramaId: id },
            headers,
            timeout: 15000,
        });

        const item = data?.data;
        if (!item) throw new Error('Drama tidak ditemukan.');

        const result = {
            id: item.dramaId || item.id,
            title: item.dramaName || item.name,
            cover: item.cover || item.coverUrl,
            description: item.introduce || item.description,
            episodes: item.totalEpisode || item.episodeCount,
            status: item.updateStatus === 1 ? 'Ongoing' : 'Completed',
            tags: item.tagList || item.tags || [],
            rating: item.score || null,
            actors: item.actorList || item.actors || [],
            director: item.director || null,
            releaseYear: item.releaseYear || null,
            platform: 'DramaBox',
            url: `${BASE_URL}/drama/${id}`,
        };

        res.json({ status: true, result });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

// Stream/Episode DramaBox
export async function dramaboxStream(req: Request, res: Response) {
    const id = (req.query.id) as string;
    const episode = (req.query.ep || req.query.episode) as string;

    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

    try {
        const params: any = { dramaId: id };
        if (episode) params.episode = parseInt(episode);

        const { data } = await axios.get(`${API_BASE}/api/v1/drama/episode/list`, {
            params,
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

// Default export: combines action via ?action= param
export default async function dramaboxHandler(req: Request, res: Response) {
    const action = (req.query.action as string) || 'search';
    if (action === 'detail') return dramaboxDetail(req, res);
    if (action === 'stream') return dramaboxStream(req, res);
    return dramaboxSearch(req, res);
}
