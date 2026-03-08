import { Request, Response } from 'express';
import axios from 'axios';

// ─── Platform Config ──────────────────────────────────────────────────────────
const PLATFORMS: Record<string, { base: string; api: string; name: string }> = {
    dramabox:  { base: 'https://dramabox.com',   api: 'https://api.dramaboxapp.com', name: 'DramaBox'  },
    reelshort: { base: 'https://reelshort.com',  api: 'https://api.reelshort.com',   name: 'ReelShort' },
    melolo:    { base: 'https://www.melolo.co',  api: 'https://www.melolo.co',       name: 'Melolo'    },
    goodshort: { base: 'https://goodshort.app',  api: 'https://api.goodshort.app',   name: 'GoodShort' },
    dramawave: { base: 'https://dramawave.net',  api: 'https://api.dramawave.net',   name: 'DramaWave' },
    freereels: { base: 'https://freereels.net',  api: 'https://api.freereels.net',   name: 'FreeReels' },
    netshort:  { base: 'https://netshort.io',    api: 'https://api.netshort.io',     name: 'NetShort'  },
};

function makeHeaders(base: string) {
    return {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Referer': base,
        'Origin': base,
    };
}

function mapDrama(item: any, name: string) {
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

// ─── Actions ──────────────────────────────────────────────────────────────────

async function actionSearch(cfg: typeof PLATFORMS[string], req: Request, res: Response) {
    const q = (req.query.query || req.query.q) as string;
    const page = parseInt(req.query.page as string) || 1;
    const result = parseInt(req.query.result as string) || 10;
    if (!q) return res.status(400).json({ status: false, message: "Parameter 'query' diperlukan." });
    try {
        const { data } = await axios.get(`${cfg.api}/api/drama/search`, {
            params: { keyword: q, page, pageSize: result },
            headers: makeHeaders(cfg.base), timeout: 15000,
        });
        const list = data?.data?.list || data?.data || data?.result || [];
        res.json({ status: true, page, total: list.length, result: list.map((i: any) => mapDrama(i, cfg.name)) });
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

async function actionHome(cfg: typeof PLATFORMS[string], _req: Request, res: Response) {
    try {
        const { data } = await axios.get(`${cfg.api}/api/drama/home`, {
            headers: makeHeaders(cfg.base), timeout: 15000,
        });
        const sections = data?.data || data?.result || {};
        const result: any = {};
        if (sections.banner || sections.bannerList) result.banner = sections.banner || sections.bannerList;
        if (sections.recommend || sections.recommendList) result.recommend = sections.recommend || sections.recommendList;
        if (sections.popular || sections.popularList) result.popular = sections.popular || sections.popularList;
        if (sections.newList || sections.latest) result.latest = sections.newList || sections.latest;
        if (Object.keys(result).length === 0 && Array.isArray(data?.data)) result.list = data.data;
        res.json({ status: true, result });
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

async function actionPopuler(cfg: typeof PLATFORMS[string], req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const result = parseInt(req.query.result as string) || 10;
    try {
        const { data } = await axios.get(`${cfg.api}/api/drama/popular`, {
            params: { page, pageSize: result },
            headers: makeHeaders(cfg.base), timeout: 15000,
        });
        const list = data?.data?.list || data?.data || data?.result || [];
        res.json({ status: true, page, total: list.length, result: list.map((i: any) => mapDrama(i, cfg.name)) });
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

async function actionNew(cfg: typeof PLATFORMS[string], req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const result = parseInt(req.query.result as string) || 10;
    try {
        const { data } = await axios.get(`${cfg.api}/api/drama/new`, {
            params: { page, pageSize: result },
            headers: makeHeaders(cfg.base), timeout: 15000,
        });
        const list = data?.data?.list || data?.data || data?.result || [];
        res.json({ status: true, page, total: list.length, result: list.map((i: any) => mapDrama(i, cfg.name)) });
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

async function actionDetail(cfg: typeof PLATFORMS[string], req: Request, res: Response) {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });
    try {
        const { data } = await axios.get(`${cfg.api}/api/drama/detail`, {
            params: { dramaId: id },
            headers: makeHeaders(cfg.base), timeout: 15000,
        });
        const item = data?.data || data?.result;
        if (!item) throw new Error('Drama tidak ditemukan.');
        res.json({
            status: true,
            result: {
                ...mapDrama(item, cfg.name),
                actors: item.actorList || item.actors || [],
                director: item.director || null,
                releaseYear: item.releaseYear || null,
                url: `${cfg.base}/drama/${id}`,
            },
        });
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

async function actionStream(cfg: typeof PLATFORMS[string], req: Request, res: Response) {
    const id = req.query.id as string;
    const ep = req.query.ep as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });
    if (!ep) return res.status(400).json({ status: false, message: "Parameter 'ep' diperlukan." });
    try {
        const { data } = await axios.get(`${cfg.api}/api/drama/episode/play`, {
            params: { dramaId: id, episode: parseInt(ep) },
            headers: makeHeaders(cfg.base), timeout: 15000,
        });
        const item = data?.data || data?.result;
        if (!item) throw new Error('Episode tidak ditemukan.');
        res.json({
            status: true,
            result: {
                id, episode: parseInt(ep),
                title: item.title || item.episodeName || `Episode ${ep}`,
                duration: item.duration || null,
                videoUrl: item.videoUrl || item.playUrl || item.url || null,
                thumbnail: item.cover || item.thumbnail || null,
                isFree: item.isFree !== false,
                platform: cfg.name,
            },
        });
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
// Route: /api/shortdrama/:platform/:action
// Contoh: /api/shortdrama/dramabox/search?query=love
//         /api/shortdrama/melolo/detail?id=123
//         /api/shortdrama/reelshort/stream?id=123&ep=1

export default async function shortDramaHandler(req: Request, res: Response) {
    const platform = req.params.platform as string;
    const action = req.params.action as string;

    const cfg = PLATFORMS[platform];
    if (!cfg) {
        return res.status(404).json({
            status: false,
            message: `Platform '${platform}' tidak ditemukan. Tersedia: ${Object.keys(PLATFORMS).join(', ')}`,
        });
    }

    switch (action) {
        case 'search':  return actionSearch(cfg, req, res);
        case 'home':    return actionHome(cfg, req, res);
        case 'populer': return actionPopuler(cfg, req, res);
        case 'new':     return actionNew(cfg, req, res);
        case 'detail':  return actionDetail(cfg, req, res);
        case 'stream':  return actionStream(cfg, req, res);
        default:
            return res.status(404).json({
                status: false,
                message: `Action '${action}' tidak ditemukan. Tersedia: search, home, populer, new, detail, stream`,
            });
    }
}
