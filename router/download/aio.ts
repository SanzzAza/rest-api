import { Request, Response } from 'express';
import axios, { AxiosError, AxiosInstance } from 'axios';

class PituCodeClient {
    private client: AxiosInstance;
    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.PITUCODE_API_KEY || '7C0dEf99730';
        this.client = axios.create({
            baseURL: 'https://api.pitucode.com',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
            },
        });
    }

    private validateUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    private async fetchDownloadData(url: string): Promise<any> {
        if (!this.validateUrl(url)) {
            throw new Error('URL tidak valid');
        }

        const { data } = await this.client.get('/aio-downloader-v2', {
            params: { url },
            headers: {
                'x-api-key': this.apiKey,
            },
        });

        return data;
    }

    private parseResponse(data: any) {
        if (!data) {
            throw new Error('Response kosong dari API');
        }

        const result = data.result || data.data || data;

        return {
            success: Boolean(data.success ?? true),
            url: data.url || result.url || null,
            source: result.source || data.source || 'unknown',
            title: result.title || data.title || 'No Title',
            thumbnail: result.thumbnail || data.thumbnail || null,
            duration: result.duration || data.duration || null,
            links: result.links || [],
            raw: data,
        };
    }

    public async process(url: string) {
        try {
            const rawData = await this.fetchDownloadData(url);
            return this.parseResponse(rawData);
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                const axiosError = e as AxiosError<any>;
                if (axiosError.response) {
                    throw new Error(
                        axiosError.response.data?.message ||
                        axiosError.response.data?.error ||
                        `API Error: ${axiosError.response.status}`
                    );
                }
                throw new Error(axiosError.message || 'Network error');
            }
            throw new Error(e.message || 'Unknown error');
        }
    }
}

export default async function downloaderHandler(req: Request, res: Response) {
    const url = (req.query.url || req.body.url) as string;

    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'URL required',
        });
    }

    try {
        const client = new PituCodeClient();
        const result = await client.process(url);

        return res.json({
            status: true,
            data: result,
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
}

export { PituCodeClient };
