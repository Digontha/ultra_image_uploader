/**
 * ImgBB image upload provider
 */

import type { UploadResult, ProviderConfig, UploadOptions } from '../types';
import { BaseImageProvider } from './BaseProvider';

interface ImgBBResponse {
  success: boolean;
  data?: {
    url: string;
    delete_url?: string;
    display_url?: string;
    size?: number;
    width?: number;
    height?: number;
    expiration?: string;
  };
  error?: {
    message: string;
    code?: number;
  };
}

export class ImgBBProvider extends BaseImageProvider {
  name = 'imgbb' as const;

  private readonly baseUrl = 'https://api.imgbb.com/1/upload';

  async upload(file: File, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult> {
    try {
      const formData = this.createFormData(file);

      // Add expiration if needed (24 hours by default, can be customized)
      if (!formData.has('expiration')) {
        formData.append('expiration', ''); // No expiration by default
      }

      const response = await this.uploadWithProgress(
        formData,
        config,
        options?.onProgress
      );

      const data: ImgBBResponse = await response.json();

      if (!data.success || !data.data?.url) {
        throw this.createUploadError(
          'UPLOAD_FAILED',
          data.error?.message || 'Image upload failed',
          data.error
        );
      }

      return {
        url: data.data.url,
        provider: this.name,
        originalFile: file,
        metadata: {
          deleteUrl: data.data.delete_url,
          displayUrl: data.data.display_url,
          size: data.data.size,
          width: data.data.width,
          height: data.data.height,
          expiration: data.data.expiration,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw this.createUploadError('UNKNOWN_ERROR', 'An unknown error occurred', error);
    }
  }

  async uploadMultiple(
    files: File[],
    config: ProviderConfig,
    options?: UploadOptions
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.upload(file, config, options));
    return Promise.all(uploadPromises);
  }

  private async uploadWithProgress(
    formData: FormData,
    config: ProviderConfig,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      this.trackProgress(xhr, onProgress);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new Response(xhr.responseText, { status: xhr.status }));
        } else {
          reject(new Error(`HTTP error! status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error occurred'));
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      xhr.open('POST', `${this.baseUrl}?key=${config.apiKey}`);
      xhr.timeout = 60000; // 60 seconds timeout
      xhr.send(formData);
    });
  }
}
