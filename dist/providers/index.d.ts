/**
 * Upload providers - ImgBB and Cloudinary
 */
import type { UploadProvider, UploadResult, ProviderConfig, UploadOptions } from '../types';
/**
 * Upload a single image
 */
export declare function uploadImage(file: File, provider: UploadProvider, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult>;
/**
 * Upload multiple images
 */
export declare function uploadImages(files: File[], provider: UploadProvider, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult[]>;
/**
 * Upload to ImgBB (convenience function)
 */
export declare function uploadImagesToImageBB(images: File[], apiKey: string): Promise<{
    urls: string[];
}>;
/**
 * Upload to Cloudinary (convenience function)
 */
export declare function uploadImagesToCloudinary(files: File[], config: {
    cloudName: string;
    uploadPreset?: string;
}, options?: UploadOptions): Promise<UploadResult[]>;
//# sourceMappingURL=index.d.ts.map