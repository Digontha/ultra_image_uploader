import type { UploadProvider, ProviderConfig, ThemeConfig } from '../types';
export declare const themes: Record<string, ThemeConfig>;
export interface ImageUploaderProps {
    images: File[];
    setImages: (images: File[]) => void;
    mode?: 'add' | 'update';
    defaultImages?: string[];
    multiple?: boolean;
    theme?: keyof typeof themes | ThemeConfig;
    uploadText?: string;
    maxSize?: number;
    allowedTypes?: string[];
    showFileSize?: boolean;
    dragAndDrop?: boolean;
    previewWidth?: number;
    previewHeight?: number;
    className?: string;
    autoUpload?: boolean;
    uploadConfig?: {
        provider: UploadProvider;
        config: ProviderConfig;
    };
    onUploadComplete?: (urls: string[]) => void;
    onUploadError?: (error: Error) => void;
}
export declare function ImageUploader({ images, setImages, mode, defaultImages, multiple, theme, uploadText, maxSize, allowedTypes, showFileSize, dragAndDrop, previewWidth, previewHeight, className, autoUpload, uploadConfig, onUploadComplete, onUploadError, }: ImageUploaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ImageUploader.d.ts.map