/**
 * Cloudinary image upload provider
 */
import type { UploadResult, ProviderConfig, UploadOptions, ImageTransformOptions } from '../types';
import { BaseImageProvider } from './BaseProvider';
export declare class CloudinaryProvider extends BaseImageProvider {
    name: "cloudinary";
    upload(file: File, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult>;
    uploadMultiple(files: File[], config: ProviderConfig, options?: UploadOptions): Promise<UploadResult[]>;
    private addTransformOptions;
    private uploadWithProgress;
    /**
     * Generate a transformed URL for an already uploaded Cloudinary image
     */
    static generateTransformedUrl(urlOrPublicId: string, transformations: ImageTransformOptions): string;
}
//# sourceMappingURL=CloudinaryProvider.d.ts.map