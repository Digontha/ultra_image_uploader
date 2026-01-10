/**
 * Main upload utilities - simplified API for users
 */
import type { UploadProvider, ProviderConfig, UploadOptions, UploadResult } from '../types';
/**
 * Upload a single image to the specified provider
 *
 * @param file - The image file to upload
 * @param provider - The provider to use ('imgbb' or 'cloudinary')
 * @param config - Provider configuration (API key, etc.)
 * @param options - Optional upload options (progress callback, transformations)
 * @returns Promise resolving to the upload result with URL and metadata
 */
export declare function uploadImage(file: File, provider: UploadProvider, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult>;
/**
 * Upload multiple images to the specified provider
 *
 * @param files - Array of image files to upload
 * @param provider - The provider to use ('imgbb' or 'cloudinary')
 * @param config - Provider configuration (API key, etc.)
 * @param options - Optional upload options (progress callback, transformations)
 * @returns Promise resolving to array of upload results with URLs and metadata
 */
export declare function uploadImages(files: File[], provider: UploadProvider, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult[]>;
/**
 * Legacy function for backward compatibility - uploads to ImgBB
 *
 * @deprecated Use `uploadImages` with explicit provider instead
 *
 * @param images - Array of image files
 * @param apiKey - ImgBB API key
 * @returns Promise resolving to object with URLs array
 */
export declare function uploadImagesToImageBB(images: File[], apiKey: string): Promise<{
    urls: string[];
}>;
/**
 * Upload to Cloudinary
 *
 * @param files - Array of image files
 * @param config - Cloudinary configuration (cloudName and optional uploadPreset)
 * @param options - Optional upload options
 * @returns Promise resolving to array of upload results
 */
export declare function uploadImagesToCloudinary(files: File[], config: {
    cloudName: string;
    uploadPreset?: string;
}, options?: UploadOptions): Promise<UploadResult[]>;
//# sourceMappingURL=upload.d.ts.map