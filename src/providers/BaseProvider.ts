/**
 * Base provider class for image uploads
 */

import type { ImageProvider, UploadResult, ProviderConfig, UploadOptions, FileValidationOptions, ValidationResult, UploadProvider } from '../types';
import { validateFileComplete } from '../utils/validation';

export abstract class BaseImageProvider implements ImageProvider {
  abstract name: UploadProvider;

  abstract upload(file: File, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult>;
  abstract uploadMultiple(files: File[], config: ProviderConfig, options?: UploadOptions): Promise<UploadResult[]>;

  async validate(file: File, validationOptions?: FileValidationOptions): Promise<ValidationResult> {
    return validateFileComplete(file, validationOptions);
  }

  protected createUploadError(code: string, message: string, details?: unknown): Error {
    const error = new Error(message) as Error & { code: string; provider: string; details?: unknown };
    error.code = code;
    error.provider = this.name;
    error.details = details;
    return error;
  }

  protected async readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  protected createFormData(file: File, additionalData?: Record<string, string>): FormData {
    const formData = new FormData();
    formData.append('image', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return formData;
  }

  protected trackProgress(
    xhr: XMLHttpRequest,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): void {
    if (!onProgress) return;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });
  }
}
