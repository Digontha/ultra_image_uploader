/**
 * Provider registry and factory
 */
import { ImgBBProvider } from './ImgBBProvider';
import { CloudinaryProvider } from './CloudinaryProvider';
class ProviderRegistry {
    constructor() {
        this.providers = new Map();
        this.registerDefaultProviders();
    }
    registerDefaultProviders() {
        this.register(new ImgBBProvider());
        this.register(new CloudinaryProvider());
    }
    register(provider) {
        this.providers.set(provider.name, provider);
    }
    get(providerName) {
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`Provider "${providerName}" is not registered. Available providers: ${Array.from(this.providers.keys()).join(', ')}`);
        }
        return provider;
    }
    has(providerName) {
        return this.providers.has(providerName);
    }
    list() {
        return Array.from(this.providers.keys());
    }
}
// Singleton instance
const registry = new ProviderRegistry();
export { registry as providerRegistry, ProviderRegistry };
export { ImgBBProvider, CloudinaryProvider };
//# sourceMappingURL=index.js.map