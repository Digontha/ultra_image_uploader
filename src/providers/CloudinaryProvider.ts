/**
 * Cloudinary image upload provider
 */

import type { UploadResult, ProviderConfig, UploadOptions, ImageTransformOptions } from '../types';
import { BaseImageProvider } from './BaseProvider';

interface CloudinaryResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  error?: {
    message: string;
  };
}

export class CloudinaryProvider extends BaseImageProvider {
  name = 'cloudinary' as const;

  async upload(file: File, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult> {
    if (!config.cloudName) {
      throw this.createUploadError(
        'MISSING_CONFIG',
        'Cloudinary cloud name is required'
      );
    }

    try {
      const formData = this.createFormData(file);
      formData.append('upload_preset', config.uploadPreset || 'unsigned_preset');

      // Add transformation options if provided
      if (options?.transformOptions) {
        this.addTransformOptions(formData, options.transformOptions);
      }

      const response = await this.uploadWithProgress(
        formData,
        config,
        options?.onProgress
      );

      const data: CloudinaryResponse = await response.json();

      if (!data.secure_url) {
        throw this.createUploadError(
          'UPLOAD_FAILED',
          data.error?.message || 'Image upload failed',
          data.error
        );
      }

      return {
        url: data.secure_url,
        provider: this.name,
        originalFile: file,
        metadata: {
          publicId: data.public_id,
          version: data.version,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes,
          resourceType: data.resource_type,
          createdAt: data.created_at,
          originalFilename: data.original_filename,
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

  private addTransformOptions(formData: FormData, options: ImageTransformOptions): void {
    const transformationParts: string[] = [];

    if (options.width) {
      transformationParts.push(`w_${options.width}`);
    }
    if (options.height) {
      transformationParts.push(`h_${options.height}`);
    }
    if (options.crop) {
      transformationParts.push(`c_${options.crop}`);
    }
    if (options.quality) {
      transformationParts.push(`q_${options.quality}`);
    }
    if (options.format) {
      transformationParts.push(`f_${options.format}`);
    }

    if (transformationParts.length > 0) {
      formData.append('transformation', transformationParts.join(','));
    }
  }

  private async uploadWithProgress(
    formData: FormData,
    config: ProviderConfig,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

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

      xhr.open('POST', uploadUrl);
      xhr.timeout = 60000; // 60 seconds timeout
      xhr.send(formData);
    });
  }

  /**
   * Generate a transformed URL for an already uploaded Cloudinary image
   */
  static generateTransformedUrl(
    urlOrPublicId: string,
    transformations: ImageTransformOptions
  ): string {
    const transformationParts: string[] = [];

    if (transformations.width) transformationParts.push(`w_${transformations.width}`);
    if (transformations.height) transformationParts.push(`h_${transformations.height}`);
    if (transformations.crop) transformationParts.push(`c_${transformations.crop}`);
    if (transformations.quality) transformationParts.push(`q_${transformations.quality}`);
    if (transformations.format) transformationParts.push(`f_${transformations.format}`);

    const transformationString = transformationParts.join(',');

    // If it's already a full URL, extract the public ID and rebuild
    if (urlOrPublicId.startsWith('http')) {
      const url = new URL(urlOrPublicId);
      const pathParts = url.pathname.split('/');
      const versionIndex = pathParts.findIndex((part) => part.startsWith('v'));
      const publicId = pathParts.slice(versionIndex + 1).join('/');

      return `${url.origin}/image/upload/${transformationString}/${publicId}`;
    }

    // If it's just a public ID, construct the URL
    return `https://res.cloudinary.com/image/upload/${transformationString}/${urlOrPublicId}`;
  }
}
