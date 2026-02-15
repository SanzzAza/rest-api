import { Request, Response } from 'express';
import axios, { AxiosInstance, AxiosError } from 'axios';

// Interface untuk request
interface DownloadRequest {
  url: string;
}

// Interface untuk response API
interface DownloadResponse {
  status: boolean;
  data?: {
    title?: string;
    url?: string;
    downloadUrl?: string;
    thumbnail?: string;
    duration?: string;
    quality?: string;
    source?: string;
    [key: string]: any;
  };
  message?: string;
  error?: string;
}

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
                'Content-Type': 'application/json',
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

        const { data } = await this.client.post('/aio-downloader-v2', 
            { url },
            {
                headers: {
                    'x-api-key': this.apiKey,
                },
            }
        );

        return data;
    }

    private parseResponse(data: any) {
        // Parsing response sesuai format API
        if (!data) {
            throw new Error('Response kosong dari API');
        }

        // Sesuaikan dengan struktur response API sebenarnya
        return {
            title: data.title || data.name || 'No Title',
            thumbnail: data.thumbnail || data.image || null,
            downloadUrl: data.downloadUrl || data.url || data.download || null,
            duration: data.duration || null,
            quality: data.quality || null,
            source: data.source || 'unknown',
            raw: data, // Data mentah untuk debugging
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
            message: 'URL required' 
        });
    }

    try {
        const client = new PituCodeClient();
        const result = await client.process(url);
        
        res.json({ 
            status: true, 
            data: result 
        });
    } catch (error: any) {
        res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
}

// Export class jika ingin digunakan di tempat lain
export { PituCodeClient };
