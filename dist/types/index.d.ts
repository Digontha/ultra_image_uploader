/**
 * Core types for Ultra Image Uploader
 */
export type UploadProvider = 'imgbb' | 'cloudinary';
export interface UploadResult {
    url: string;
    provider: UploadProvider;
    originalFile: File;
    metadata?: Record<string, unknown>;
}
export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}
export interface UploadOptions {
    onProgress?: (progress: UploadProgress) => void;
    transformOptions?: ImageTransformOptions;
}
export interface ImageTransformOptions {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
}
export interface ProviderConfig {
    apiKey?: string;
    cloudName?: string;
    uploadPreset?: string;
    baseUrl?: string;
}
export interface FileValidationOptions {
    maxSize?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    allowedTypes?: string[];
}
export interface ValidationError {
    code: string;
    message: string;
    field?: string;
}
export interface ValidationResult {
    valid: boolean;
    errors?: ValidationError[];
}
export interface ThemeConfig {
    primary?: string;
    background?: string;
    border?: string;
    text?: string;
    textSecondary?: string;
    error?: string;
    success?: string;
    radius?: string;
}
//# sourceMappingURL=index.d.ts.map