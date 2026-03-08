import { Request, Response } from 'express';
import axios from 'axios';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const UA = 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

async function get(url: string, params: Record<string, any> = {}) {
    const { data } = await axios.get(url, {
        params,
        headers: { 'User-Agent': UA, 'Accept': 'application/json' },
        timeout: 15000,
    });
    return data;
}

// ══════════════════════════════════════════════════════════════════════════════
// MELOLO
// ══════════════════════════════════════════════════════════════════════════════
const MELOLO = 'https://api.sonzaix.indevs.in/melolo';

export async function melloloSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const result = parseInt(req.query.result as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });
    try {
        const data = await get(`${MELOLO}/search`, { q, result, page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function melloloHome(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
        const data = await get(`${MELOLO}/home`, { page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function melloloPopuler(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
        const data = await get(`${MELOLO}/populer`, { page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function melloloNew(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
        const data = await get(`${MELOLO}/new`, { page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function melloloDetail(req: Request, res: Response) {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });
    try {
        const data = await get(`${MELOLO}/detail/${id}`);
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function melloloStream(req: Request, res: Response) {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });
    try {
        const data = await get(`${MELOLO}/stream/${id}`);
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// DRAMABOX
// ══════════════════════════════════════════════════════════════════════════════
const DRAMABOX = 'https://api.sonzaix.indevs.in/dramabox';

export async function dramaboxSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const result = parseInt(req.query.result as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });
    try {
        const data = await get(`${DRAMABOX}/search`, { q, result, page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramaboxHome(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
        const data = await get(`${DRAMABOX}/home`, { page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramaboxPopuler(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
        const data = await get(`${DRAMABOX}/populer`, { page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramaboxNew(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try {
        const data = await get(`${DRAMABOX}/new`, { page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramaboxDetail(req: Request, res: Response) {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });
    try {
        const data = await get(`${DRAMABOX}/detail/${id}`);
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramaboxStream(req: Request, res: Response) {
    const dramaId = req.query.dramaId as string;
    const episodeIndex = req.query.episodeIndex as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    if (!episodeIndex) return res.status(400).json({ status: false, message: "Parameter 'episodeIndex' diperlukan." });
    try {
        const data = await get(`${DRAMABOX}/stream`, { dramaId, episodeIndex: parseInt(episodeIndex) });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// REELSHORT
// ══════════════════════════════════════════════════════════════════════════════
const REELSHORT = 'https://api.sonzaix.indevs.in/reelshort';

export async function reelshortSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const page = parseInt(req.query.page as string) || 1;
    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });
    try {
        const data = await get(`${REELSHORT}/search`, { q, page });
        res.json(data);
    } catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function reelshortHome(_req: Request, res: Response) {
    try { res.json(await get(`${REELSHORT}/home`)); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function reelshortPopuler(_req: Request, res: Response) {
    try { res.json(await get(`${REELSHORT}/populer`)); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function reelshortNew(_req: Request, res: Response) {
    try { res.json(await get(`${REELSHORT}/new`)); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function reelshortDetail(req: Request, res: Response) {
    const bookId = (req.query.bookId || req.query.id) as string;
    if (!bookId) return res.status(400).json({ status: false, message: "Parameter 'bookId' diperlukan." });
    try { res.json(await get(`${REELSHORT}/detail`, { bookId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function reelshortStream(req: Request, res: Response) {
    const bookId = req.query.bookId as string;
    const chapterId = req.query.chapterId as string;
    if (!bookId) return res.status(400).json({ status: false, message: "Parameter 'bookId' diperlukan." });
    if (!chapterId) return res.status(400).json({ status: false, message: "Parameter 'chapterId' diperlukan." });
    try { res.json(await get(`${REELSHORT}/stream`, { bookId, chapterId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// FREEREELS
// ══════════════════════════════════════════════════════════════════════════════
const FREEREELS = 'https://api.sonzaix.indevs.in/freereels';

export async function freereelsSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const page = parseInt(req.query.page as string) || 1;
    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });
    try { res.json(await get(`${FREEREELS}/search`, { q, page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function freereelsHome(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${FREEREELS}/home`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function freereelsPopuler(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${FREEREELS}/populer`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function freereelsNew(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${FREEREELS}/new`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function freereelsDetail(req: Request, res: Response) {
    const dramaId = (req.query.dramaId || req.query.id) as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    try { res.json(await get(`${FREEREELS}/detail`, { dramaId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function freereelsStream(req: Request, res: Response) {
    const dramaId = req.query.dramaId as string;
    const episode = req.query.episode as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    if (!episode) return res.status(400).json({ status: false, message: "Parameter 'episode' diperlukan." });
    try { res.json(await get(`${FREEREELS}/stream`, { dramaId, episode: parseInt(episode) })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// NETSHORT
// ══════════════════════════════════════════════════════════════════════════════
const NETSHORT = 'https://api.sonzaix.indevs.in/netshort';

export async function netshortSearch(req: Request, res: Response) {
    const query = (req.query.query || req.query.q) as string;
    const page = parseInt(req.query.page as string) || 1;
    if (!query) return res.status(400).json({ status: false, message: "Parameter 'query' diperlukan." });
    try { res.json(await get(`${NETSHORT}/search`, { query, page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function netshortHome(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${NETSHORT}/home`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function netshortPopuler(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${NETSHORT}/populer`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function netshortNew(_req: Request, res: Response) {
    try { res.json(await get(`${NETSHORT}/new`)); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function netshortDetail(req: Request, res: Response) {
    const dramaId = (req.query.dramaId || req.query.id) as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    try { res.json(await get(`${NETSHORT}/detail`, { dramaId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function netshortStream(req: Request, res: Response) {
    const dramaId = (req.query.dramaId || req.query.id) as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    try { res.json(await get(`${NETSHORT}/stream`, { dramaId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// MELOSHORT
// ══════════════════════════════════════════════════════════════════════════════
const MELOSHORT = 'https://api.sonzaix.indevs.in/meloshort';

export async function meloshortSearch(req: Request, res: Response) {
    const query = (req.query.query || req.query.q) as string;
    if (!query) return res.status(400).json({ status: false, message: "Parameter 'query' diperlukan." });
    try { res.json(await get(`${MELOSHORT}/search`, { query })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function meloshortHome(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${MELOSHORT}/home`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function meloshortPopuler(_req: Request, res: Response) {
    try { res.json(await get(`${MELOSHORT}/populer`)); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function meloshortNew(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${MELOSHORT}/new`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function meloshortDetail(req: Request, res: Response) {
    const dramaId = (req.query.dramaId || req.query.id) as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    try { res.json(await get(`${MELOSHORT}/detail`, { dramaId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function meloshortStream(req: Request, res: Response) {
    const dramaId = req.query.dramaId as string;
    const episodeId = req.query.episodeId as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    if (!episodeId) return res.status(400).json({ status: false, message: "Parameter 'episodeId' diperlukan." });
    try { res.json(await get(`${MELOSHORT}/stream`, { dramaId, episodeId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// GOODSHORT
// ══════════════════════════════════════════════════════════════════════════════
const GOODSHORT = 'https://api.sonzaix.indevs.in/goodshort';

export async function goodshortSearch(req: Request, res: Response) {
    const query = (req.query.query || req.query.q) as string;
    const page = parseInt(req.query.page as string) || 1;
    if (!query) return res.status(400).json({ status: false, message: "Parameter 'query' diperlukan." });
    try { res.json(await get(`${GOODSHORT}/search`, { query, page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function goodshortHome(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${GOODSHORT}/home`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function goodshortPopuler(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${GOODSHORT}/populer`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function goodshortNew(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${GOODSHORT}/new`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function goodshortDetail(req: Request, res: Response) {
    const bookId = (req.query.bookId || req.query.id) as string;
    if (!bookId) return res.status(400).json({ status: false, message: "Parameter 'bookId' diperlukan." });
    try { res.json(await get(`${GOODSHORT}/detail`, { bookId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function goodshortStream(req: Request, res: Response) {
    const bookId = (req.query.bookId || req.query.id) as string;
    if (!bookId) return res.status(400).json({ status: false, message: "Parameter 'bookId' diperlukan." });
    try { res.json(await get(`${GOODSHORT}/stream`, { bookId })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// DRAMAWAVE
// ══════════════════════════════════════════════════════════════════════════════
const DRAMAWAVE = 'https://api.sonzaix.indevs.in/dramawave';

export async function dramawaveSearch(req: Request, res: Response) {
    const q = (req.query.q || req.query.query) as string;
    const page = parseInt(req.query.page as string) || 1;
    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });
    try { res.json(await get(`${DRAMAWAVE}/search`, { q, page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramawaveHome(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${DRAMAWAVE}/home`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramawavePopuler(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${DRAMAWAVE}/populer`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramawaveNew(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    try { res.json(await get(`${DRAMAWAVE}/new`, { page })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramawaveDetail(req: Request, res: Response) {
    const id = (req.query.id || req.query.dramaId) as string;
    if (!id) return res.status(400).json({ status: false, message: "Parameter 'id' diperlukan." });
    try { res.json(await get(`${DRAMAWAVE}/detail`, { id })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

export async function dramawaveStream(req: Request, res: Response) {
    const dramaId = req.query.dramaId as string;
    const episode = req.query.episode as string;
    if (!dramaId) return res.status(400).json({ status: false, message: "Parameter 'dramaId' diperlukan." });
    if (!episode) return res.status(400).json({ status: false, message: "Parameter 'episode' diperlukan." });
    try { res.json(await get(`${DRAMAWAVE}/stream`, { dramaId, episode: parseInt(episode) })); }
    catch (e: any) { res.status(500).json({ status: false, message: e.message }); }
}

// ══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT (tidak dipakai tapi wajib ada)
// ══════════════════════════════════════════════════════════════════════════════
export default melloloHome;
