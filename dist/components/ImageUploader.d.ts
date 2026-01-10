import type { UploadProvider, ProviderConfig } from '../types';
/**
 * Theme configuration for the uploader
 */
export interface UploaderTheme {
    primary?: string;
    primaryHover?: string;
    background?: string;
    border?: string;
    text?: string;
    textSecondary?: string;
    error?: string;
    success?: string;
    radius?: string;
}
export type ThemePreset = 'light' | 'dark' | 'modern' | 'minimal' | 'colorful';
/**
 * Props for the ImageUploader component
 */
export interface ImageUploaderProps {
    /** Currently selected image files */
    images: File[];
    /** Function to update the images array */
    setImages: (images: File[]) => void;
    /** Operation mode */
    mode?: 'add' | 'update';
    /** Existing image URLs for update mode */
    defaultImages?: string[];
    /** Allow multiple file selection */
    multiple?: boolean;
    /** Custom CSS classes */
    className?: string;
    /** Upload area text */
    uploadText?: string;
    /** File type hint text */
    typeText?: string;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Allowed file types */
    allowedTypes?: string[];
    /** Theme preset */
    theme?: ThemePreset;
    /** Custom theme object */
    customTheme?: UploaderTheme;
    /** Show file size preview */
    showFileSize?: boolean;
    /** Enable drag and drop */
    dragAndDrop?: boolean;
    /** Image preview width */
    previewWidth?: number;
    /** Image preview height */
    previewHeight?: number;
    /** Callback when upload completes */
    onUploadComplete?: (urls: string[]) => void;
    /** Callback when upload fails */
    onUploadError?: (error: Error) => void;
    /** Auto upload on file selection */
    autoUpload?: boolean;
    /** Upload provider configuration */
    uploadConfig?: {
        provider: UploadProvider;
        config: ProviderConfig;
    };
}
export declare function ImageUploader({ images, setImages, mode, defaultImages, multiple, className, uploadText, typeText, maxSize, allowedTypes, theme, customTheme, showFileSize, dragAndDrop, previewWidth, previewHeight, onUploadComplete, onUploadError, autoUpload, uploadConfig, }: ImageUploaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ImageUploader.d.ts.map