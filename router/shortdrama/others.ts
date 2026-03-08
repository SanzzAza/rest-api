import { Request, Response } from 'express';
import axios from 'axios';

// ─── Platform Configs ───────────────────────────────────────────────
const PLATFORMS: Record<string, { base: string; api: string; name: string }> = {
    goodshort: {
        base: 'https://goodshort.app',
        api: 'https://api.goodshort.app',
        name: 'GoodShort',
    },
    dramawave: {
        base: 'https://dramawave.net',
        api: 'https://api.dramawave.net',
        name: 'DramaWave',
    },
    freereels: {
        base: 'https://freereels.net',
        api: 'https://api.freereels.net',
        name: 'FreeReels',
    },
    netshort: {
        base: 'https://netshort.io',
        api: 'https://api.netshort.io',
        name: 'NetShort',
    },
};

function getHeaders(base: string) {
    return {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Referer': base,
        'Origin': base,
    };
}

function mapItem(item: any, name: string) {
    return {
        id: item.dramaId || item.id || item.seriesId,
        title: item.dramaName || item.title || item.name || item.seriesName,
        cover: item.cover || item.coverUrl || item.poster || item.thumbnail,
        description: item.introduce || item.description || item.intro || '',
        episodes: item.totalEpisode || item.episodeCount || item.totalEpisodes || 0,
        status: (item.isFinished || item.isCompleted || item.updateStatus === 0) ? 'Completed' : 'Ongoing',
        tags: item.tagList || item.tags || item.categories || [],
        platform: name,
    };
}

function mapEpisode(ep: any) {
    return {
        episode: ep.episode || ep.episodeNo || ep.ep,
        title: ep.title || ep.episodeName || `Episode ${ep.episode || ep.ep}`,
        duration: ep.duration || null,
        videoUrl: ep.videoUrl || ep.playUrl || ep.url || ep.streamUrl || null,
        thumbnail: ep.cover || ep.thumbnail || null,
        isFree: ep.isFree !== false,
    };
}

// ─── Generic Handler Factory ─────────────────────────────────────────
function createHandlers(platformKey: string) {
    const platform = PLATFORMS[platformKey];

    async function search(req: Request, res: Response) {
        const q = (req.query.q || req.query.query) as string;
        const page = parseInt(req.query.page as string) || 1;
        if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });

        try {
            const { data } = await axios.get(`${platform.api}/api/drama/search`, {
                params: { keyword: q, page, pageSize: 20, size: 20 },
                headers: getHeaders(platform.base),
                timeout: 15000,
            });

            const list = data?.data?.list || data?.data || data?.result?.list || [];
            res.json({ status: true, page, total: list.length, result: list.map((i: any) => mapItem(i, platform.name)) });
        } catch (error: any) {
            res.status(500).json({ status: false, message: error.message });
        }
    }

    async function detail(req: Request, res: Response) {
        const id = req.query.id as string;
        if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

        try {
            const { data } = await axios.get(`${platform.api}/api/drama/detail`, {
                params: { dramaId: id },
                headers: getHeaders(platform.base),
                timeout: 15000,
            });

            const item = data?.data;
            if (!item) throw new Error('Drama tidak ditemukan.');

            const result = {
                ...mapItem(item, platform.name),
                actors: item.actorList || item.actors || [],
                director: item.director || null,
                releaseYear: item.releaseYear || null,
                url: `${platform.base}/drama/${id}`,
            };

            res.json({ status: true, result });
        } catch (error: any) {
            res.status(500).json({ status: false, message: error.message });
        }
    }

    async function stream(req: Request, res: Response) {
        const id = req.query.id as string;
        const episode = req.query.ep as string;
        if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });

        try {
            const { data } = await axios.get(`${platform.api}/api/drama/episode/list`, {
                params: { dramaId: id, episode: episode ? parseInt(episode) : undefined },
                headers: getHeaders(platform.base),
                timeout: 15000,
            });

            const list = data?.data?.list || data?.data || [];
            res.json({ status: true, dramaId: id, total: list.length, result: list.map(mapEpisode) });
        } catch (error: any) {
            res.status(500).json({ status: false, message: error.message });
        }
    }

    return { search, detail, stream };
}

// ─── GoodShort ───────────────────────────────────────────────────────
const goodshort = createHandlers('goodshort');
export async function goodshortHandler(req: Request, res: Response) {
    const action = (req.query.action as string) || 'search';
    if (action === 'detail') return goodshort.detail(req, res);
    if (action === 'stream') return goodshort.stream(req, res);
    return goodshort.search(req, res);
}

// ─── DramaWave ───────────────────────────────────────────────────────
const dramawave = createHandlers('dramawave');
export async function dramawaveHandler(req: Request, res: Response) {
    const action = (req.query.action as string) || 'search';
    if (action === 'detail') return dramawave.detail(req, res);
    if (action === 'stream') return dramawave.stream(req, res);
    return dramawave.search(req, res);
}

// ─── FreeReels ───────────────────────────────────────────────────────
const freereels = createHandlers('freereels');
export async function freereelsHandler(req: Request, res: Response) {
    const action = (req.query.action as string) || 'search';
    if (action === 'detail') return freereels.detail(req, res);
    if (action === 'stream') return freereels.stream(req, res);
    return freereels.search(req, res);
}

// ─── NetShort ────────────────────────────────────────────────────────
const netshort = createHandlers('netshort');
export async function netshortHandler(req: Request, res: Response) {
    const action = (req.query.action as string) || 'search';
    if (action === 'detail') return netshort.detail(req, res);
    if (action === 'stream') return netshort.stream(req, res);
    return netshort.search(req, res);
}

// Default export (GoodShort as primary)
export default goodshortHandler;
