/**
 * Upload providers - ImgBB and Cloudinary
 */

import type { UploadProvider, UploadResult, ProviderConfig, UploadOptions } from '../types';

/**
 * Upload to ImgBB
 */
async function uploadToImgBB(
  file: File,
  config: ProviderConfig,
  options?: UploadOptions
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetchWithProgress(
    `https://api.imgbb.com/1/upload?key=${config.apiKey}`,
    formData,
    options?.onProgress
  );

  const data = await response.json();

  if (!data.success || !data.data?.url) {
    throw new Error(data.error?.message || 'ImgBB upload failed');
  }

  return {
    url: data.data.url,
    provider: 'imgbb',
    originalFile: file,
    metadata: {
      deleteUrl: data.data.delete_url,
      size: data.data.size,
      width: data.data.width,
      height: data.data.height,
    },
  };
}

/**
 * Upload to Cloudinary
 */
async function uploadToCloudinary(
  file: File,
  config: ProviderConfig,
  options?: UploadOptions
): Promise<UploadResult> {
  if (!config.cloudName) {
    throw new Error('Cloudinary cloudName is required');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset || 'unsigned_preset');

  if (options?.transformOptions) {
    const transforms = [];
    if (options.transformOptions.width) transforms.push(`w_${options.transformOptions.width}`);
    if (options.transformOptions.height) transforms.push(`h_${options.transformOptions.height}`);
    if (options.transformOptions.crop) transforms.push(`c_${options.transformOptions.crop}`);
    if (options.transformOptions.quality) transforms.push(`q_${options.transformOptions.quality}`);
    if (transforms.length > 0) {
      formData.append('transformation', transforms.join(','));
    }
  }

  const response = await fetchWithProgress(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    formData,
    options?.onProgress
  );

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }

  return {
    url: data.secure_url,
    provider: 'cloudinary',
    originalFile: file,
    metadata: {
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    },
  };
}

/**
 * Fetch with progress tracking
 */
function fetchWithProgress(
  url: string,
  formData: FormData,
  onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(xhr.responseText, { status: xhr.status }));
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timeout'));
    xhr.open('POST', url);
    xhr.timeout = 60000;
    xhr.send(formData);
  });
}

/**
 * Upload a single image
 */
export async function uploadImage(
  file: File,
  provider: UploadProvider,
  config: ProviderConfig,
  options?: UploadOptions
): Promise<UploadResult> {
  if (provider === 'imgbb') {
    return uploadToImgBB(file, config, options);
  }
  return uploadToCloudinary(file, config, options);
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  provider: UploadProvider,
  config: ProviderConfig,
  options?: UploadOptions
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadImage(file, provider, config, options)));
}

/**
 * Upload to ImgBB (convenience function)
 */
export async function uploadImagesToImageBB(
  images: File[],
  apiKey: string
): Promise<{ urls: string[] }> {
  const results = await uploadImages(images, 'imgbb', { apiKey });
  return { urls: results.map((r) => r.url) };
}

/**
 * Upload to Cloudinary (convenience function)
 */
export async function uploadImagesToCloudinary(
  files: File[],
  config: { cloudName: string; uploadPreset?: string },
  options?: UploadOptions
): Promise<UploadResult[]> {
  return uploadImages(files, 'cloudinary', config, options);
}
