/**
 * Ultra Image Uploader
 * A modern, flexible image upload solution for React with support for multiple providers
 */

// Components
export { ImageUploader } from './components/ImageUploader';
export type {
  ImageUploaderProps,
  UploaderTheme,
  ThemePreset,
} from './components/ImageUploader';

// Upload utilities
export {
  uploadImage,
  uploadImages,
  uploadImagesToImageBB,
  uploadImagesToCloudinary,
} from './utils/upload';

// Providers
export { ImgBBProvider, CloudinaryProvider, providerRegistry } from './providers';

// Types
export type {
  UploadProvider,
  UploadProgress,
  ProgressCallback,
  UploadResult,
  UploadOptions,
  ImageTransformOptions,
  ProviderConfig,
  ImageUploadConfig,
  ValidationError,
  ValidationResult,
  FileValidationOptions,
  ImageProvider,
  UploadError,
} from './types';

// Validation utilities - re-export from validation.ts
export {
  validateImageFile,
  validateImageDimensions,
  validateFileComplete,
  formatFileSize,
  getFileExtension,
  isImageFile,
} from './utils/validation';
