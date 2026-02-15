import axios, { AxiosError } from 'axios';

// Interface untuk request body
interface DownloadRequest {
  url: string;
}

// Interface untuk response (sesuaikan dengan response API sebenarnya)
interface DownloadResponse {
  success: boolean;
  data?: {
    title?: string;
    url?: string;
    downloadUrl?: string;
    thumbnail?: string;
    duration?: string;
    // Tambahkan field lain sesuai response API
  };
  message?: string;
  error?: string;
}

// Konfigurasi
const API_KEY: string = process.env.PITUCODE_API_KEY || '7C0dEf99730';
const API_URL: string = 'https://api.pitucode.com/aio-downloader-v2';
const TARGET_URL: string = 'https://www.youtube.com/watch?v=example';

// Function untuk download
const downloadMedia = async (url: string): Promise<void> => {
  try {
    const response = await axios.post<DownloadResponse>(
      API_URL,
      {
        url: url
      } as DownloadRequest,
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Success:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<DownloadResponse>;
      if (axiosError.response) {
        console.error('Error:', axiosError.response.status, axiosError.response.data);
      } else {
        console.error('Error:', axiosError.message);
      }
    } else {
      console.error('Unknown error:', error);
    }
  }
};

// Jalankan function
downloadMedia(TARGET_URL);
