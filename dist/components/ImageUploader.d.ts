import type { UploadProvider, ProviderConfig } from '../types';
export interface ImageUploaderProps {
    images: File[];
    setImages: (images: File[]) => void;
    multiple?: boolean;
    maxSize?: number;
    allowedTypes?: string[];
    uploadText?: string;
    className?: string;
    onUploadComplete?: (urls: string[]) => void;
    onUploadError?: (error: Error) => void;
    autoUpload?: boolean;
    uploadConfig?: {
        provider: UploadProvider;
        config: ProviderConfig;
    };
}
export declare function ImageUploader({ images, setImages, multiple, maxSize, allowedTypes, className, onUploadComplete, onUploadError, autoUpload, uploadConfig, }: ImageUploaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ImageUploader.d.ts.map