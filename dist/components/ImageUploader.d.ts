import type { UploadProvider, ProviderConfig } from '../types';
export interface ImageUploaderProps {
    images: File[];
    setImages: (images: File[]) => void;
    multiple?: boolean;
    maxSize?: number;
    allowedTypes?: string[];
    maxImages?: number;
    className?: string;
    containerClassName?: string;
    uploadText?: string;
    dragText?: string;
    theme?: 'light' | 'dark';
    onThemeChange?: (theme: 'light' | 'dark') => void;
    showThemeToggle?: boolean;
    showImageCount?: boolean;
    enableReorder?: boolean;
    gridCols?: number;
    cardClassName?: string;
    onUploadComplete?: (urls: string[]) => void;
    onUploadError?: (error: Error) => void;
    autoUpload?: boolean;
    uploadConfig?: {
        provider: UploadProvider;
        config: ProviderConfig;
    };
}
export declare function ImageUploader({ images, setImages, multiple, maxSize, allowedTypes, maxImages, className, containerClassName, uploadText, dragText, theme: externalTheme, onThemeChange, showThemeToggle, showImageCount, enableReorder, gridCols, cardClassName, onUploadComplete, onUploadError, autoUpload, uploadConfig, }: ImageUploaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ImageUploader.d.ts.map