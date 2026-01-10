/**
 * Base provider class for image uploads
 */
import type { ImageProvider, UploadResult, ProviderConfig, UploadOptions, FileValidationOptions, ValidationResult, UploadProvider } from '../types';
export declare abstract class BaseImageProvider implements ImageProvider {
    abstract name: UploadProvider;
    abstract upload(file: File, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult>;
    abstract uploadMultiple(files: File[], config: ProviderConfig, options?: UploadOptions): Promise<UploadResult[]>;
    validate(file: File, validationOptions?: FileValidationOptions): Promise<ValidationResult>;
    protected createUploadError(code: string, message: string, details?: unknown): Error;
    protected readFileAsDataURL(file: File): Promise<string>;
    protected createFormData(file: File, additionalData?: Record<string, string>): FormData;
    protected trackProgress(xhr: XMLHttpRequest, onProgress?: (progress: {
        loaded: number;
        total: number;
        percentage: number;
    }) => void): void;
}
//# sourceMappingURL=BaseProvider.d.ts.map