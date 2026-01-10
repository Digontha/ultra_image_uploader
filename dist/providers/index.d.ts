/**
 * Provider registry and factory
 */
import type { UploadProvider, ImageProvider } from '../types';
import { ImgBBProvider } from './ImgBBProvider';
import { CloudinaryProvider } from './CloudinaryProvider';
declare class ProviderRegistry {
    private providers;
    constructor();
    private registerDefaultProviders;
    register(provider: ImageProvider): void;
    get(providerName: UploadProvider): ImageProvider;
    has(providerName: UploadProvider): boolean;
    list(): UploadProvider[];
}
declare const registry: ProviderRegistry;
export { registry as providerRegistry, ProviderRegistry };
export { ImgBBProvider, CloudinaryProvider };
export type { ImageProvider } from '../types';
//# sourceMappingURL=index.d.ts.map