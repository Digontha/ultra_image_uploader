/**
 * Ultra Image Uploader
 * A modern, flexible image upload solution for React with support for multiple providers
 */
export { ImageUploader } from './components/ImageUploader';
export type { ImageUploaderProps, UploaderTheme, ThemePreset, } from './components/ImageUploader';
export { uploadImage, uploadImages, uploadImagesToImageBB, uploadImagesToCloudinary, } from './utils/upload';
export { ImgBBProvider, CloudinaryProvider, providerRegistry } from './providers';
export type { UploadProvider, UploadProgress, ProgressCallback, UploadResult, UploadOptions, ImageTransformOptions, ProviderConfig, ImageUploadConfig, ValidationError, ValidationResult, FileValidationOptions, ImageProvider, UploadError, } from './types';
export { validateImageFile, validateImageDimensions, validateFileComplete, formatFileSize, getFileExtension, isImageFile, } from './utils/validation';
//# sourceMappingURL=index.d.ts.map