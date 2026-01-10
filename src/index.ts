/**
 * Ultra Image Uploader
 * Modern image upload component with ImgBB & Cloudinary support
 */

// Component
export { ImageUploader } from './components/ImageUploader';
export type { ImageUploaderProps } from './components/ImageUploader';

// Upload functions
export {
  uploadImage,
  uploadImages,
  uploadImagesToImageBB,
  uploadImagesToCloudinary,
} from './providers';

// Types
export type {
  UploadProvider,
  UploadResult,
  UploadProgress,
  UploadOptions,
  ImageTransformOptions,
  ProviderConfig,
  FileValidationOptions,
  ValidationResult,
  ValidationError,
} from './types';

// Validation
export {
  validateImageFile,
  validateImageDimensions,
  validateFileComplete,
  formatFileSize,
  isImageFile,
} from './utils/validation';
