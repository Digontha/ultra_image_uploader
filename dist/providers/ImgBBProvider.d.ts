/**
 * ImgBB image upload provider
 */
import type { UploadResult, ProviderConfig, UploadOptions } from '../types';
import { BaseImageProvider } from './BaseProvider';
export declare class ImgBBProvider extends BaseImageProvider {
    name: "imgbb";
    private readonly baseUrl;
    upload(file: File, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult>;
    uploadMultiple(files: File[], config: ProviderConfig, options?: UploadOptions): Promise<UploadResult[]>;
    private uploadWithProgress;
}
//# sourceMappingURL=ImgBBProvider.d.ts.map