/**
 * Ultra Image Uploader
 * Modern image upload component with ImgBB & Cloudinary support
 */
export { ImageUploader } from './components/ImageUploader';
export type { ImageUploaderProps } from './components/ImageUploader';
export { uploadImage, uploadImages, uploadImagesToImageBB, uploadImagesToCloudinary, } from './providers';
export type { UploadProvider, UploadResult, UploadProgress, UploadOptions, ImageTransformOptions, ProviderConfig, FileValidationOptions, ValidationResult, ValidationError, } from './types';
export { validateImageFile, validateImageDimensions, validateFileComplete, formatFileSize, isImageFile, } from './utils/validation';
//# sourceMappingURL=index.d.ts.map