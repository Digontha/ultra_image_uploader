/**
 * Ultra Image Uploader
 * A modern, flexible image upload solution for React with support for multiple providers
 */
// Components
export { ImageUploader } from './components/ImageUploader';
// Upload utilities
export { uploadImage, uploadImages, uploadImagesToImageBB, uploadImagesToCloudinary, } from './utils/upload';
// Providers
export { ImgBBProvider, CloudinaryProvider, providerRegistry } from './providers';
// Validation utilities - re-export from validation.ts
export { validateImageFile, validateImageDimensions, validateFileComplete, formatFileSize, getFileExtension, isImageFile, } from './utils/validation';
//# sourceMappingURL=index.js.map