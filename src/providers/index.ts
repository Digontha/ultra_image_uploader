/**
 * Provider registry and factory
 */

import type { UploadProvider, ImageProvider } from '../types';
import { ImgBBProvider } from './ImgBBProvider';
import { CloudinaryProvider } from './CloudinaryProvider';

class ProviderRegistry {
  private providers: Map<UploadProvider, ImageProvider> = new Map();

  constructor() {
    this.registerDefaultProviders();
  }

  private registerDefaultProviders(): void {
    this.register(new ImgBBProvider());
    this.register(new CloudinaryProvider());
  }

  register(provider: ImageProvider): void {
    this.providers.set(provider.name, provider);
  }

  get(providerName: UploadProvider): ImageProvider {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider "${providerName}" is not registered. Available providers: ${Array.from(this.providers.keys()).join(', ')}`);
    }
    return provider;
  }

  has(providerName: UploadProvider): boolean {
    return this.providers.has(providerName);
  }

  list(): UploadProvider[] {
    return Array.from(this.providers.keys());
  }
}

// Singleton instance
const registry = new ProviderRegistry();

export { registry as providerRegistry, ProviderRegistry };
export { ImgBBProvider, CloudinaryProvider };
export type { ImageProvider } from '../types';
