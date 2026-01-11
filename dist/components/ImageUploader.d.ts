import React from "react";
import type { UploadProvider, ProviderConfig } from "../types";
export declare const themes: {
    nature: {
        name: string;
        colors: {
            primary: string;
            primaryHover: string;
            background: string;
            border: string;
            text: string;
            textSecondary: string;
            cardBg: string;
            cardBorder: string;
            shadow: string;
        };
    };
    modern: {
        name: string;
        colors: {
            primary: string;
            primaryHover: string;
            background: string;
            border: string;
            text: string;
            textSecondary: string;
            cardBg: string;
            cardBorder: string;
            shadow: string;
        };
    };
    fresh: {
        name: string;
        colors: {
            primary: string;
            primaryHover: string;
            background: string;
            border: string;
            text: string;
            textSecondary: string;
            cardBg: string;
            cardBorder: string;
            shadow: string;
        };
    };
    dark: {
        name: string;
        colors: {
            primary: string;
            primaryHover: string;
            background: string;
            border: string;
            text: string;
            textSecondary: string;
            cardBg: string;
            cardBorder: string;
            shadow: string;
        };
    };
    ocean: {
        name: string;
        colors: {
            primary: string;
            primaryHover: string;
            background: string;
            border: string;
            text: string;
            textSecondary: string;
            cardBg: string;
            cardBorder: string;
            shadow: string;
        };
    };
};
export type ThemeName = keyof typeof themes;
export type CustomTheme = (typeof themes)[ThemeName];
export interface ImageUploaderTextLabels {
    uploadAreaText?: string;
    uploadAreaDragText?: string;
    uploadButton?: string;
    uploadingButton?: string;
    imageCountLabel?: string;
    removeImageLabel?: string;
    uploadImagesLabel?: string;
    dismissErrorLabel?: string;
    uploadErrorTitle?: string;
    uploadErrorMissingImgBBKey?: string;
    uploadErrorMissingImgBBKeyEmpty?: string;
    uploadErrorMissingCloudinaryName?: string;
    uploadErrorMissingCloudinaryNameEmpty?: string;
}
export interface ImageUploaderProps {
    images: File[];
    setImages: (images: File[]) => void;
    textLabels?: ImageUploaderTextLabels;
    mode?: "add" | "update";
    defaultImages?: string[];
    multiple?: boolean;
    maxSize?: number;
    allowedTypes?: string[];
    maxImages?: number;
    uploadConfig?: {
        provider: UploadProvider;
        config: ProviderConfig;
    };
    autoUpload?: boolean;
    onUploadComplete?: (urls: string[]) => void;
    onUploadError?: (error: Error) => void;
    theme?: ThemeName;
    customTheme?: CustomTheme;
    showThemeSelector?: boolean;
    previewSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    borderRadius?: "none" | "sm" | "md" | "lg" | "full";
    className?: string;
    containerClassName?: string;
    showImageCount?: boolean;
    showFileSize?: boolean;
    showFileName?: boolean;
    customUploadButton?: React.ReactNode;
    hideDefaultUploadArea?: boolean;
    onUploadClick?: () => void;
}
export declare function ImageUploader({ images, setImages, textLabels, mode, defaultImages, multiple, maxSize, allowedTypes, maxImages, uploadConfig, autoUpload, onUploadComplete, onUploadError, theme, customTheme, showThemeSelector, previewSize, borderRadius, className, containerClassName, showImageCount, showFileSize, showFileName, customUploadButton, hideDefaultUploadArea, onUploadClick, }: ImageUploaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ImageUploader.d.ts.map