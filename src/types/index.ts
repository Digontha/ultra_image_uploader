/**
 * Core types and interfaces for Ultra Image Uploader
 */

export type UploadProvider = 'imgbb' | 'cloudinary';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type ProgressCallback = (progress: UploadProgress) => void;

export interface UploadResult {
  url: string;
  provider: UploadProvider;
  originalFile: File;
  metadata?: Record<string, unknown>;
}

export interface UploadOptions {
  onProgress?: ProgressCallback;
  transformOptions?: ImageTransformOptions;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
  format?: string;
}

export interface ProviderConfig {
  apiKey: string;
  uploadPreset?: string;
  cloudName?: string;
  baseUrl?: string;
}

export interface ImageUploadConfig {
  provider: UploadProvider;
  config: ProviderConfig;
  options?: UploadOptions;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  allowedTypes?: string[];
}

export interface ImageProvider {
  name: UploadProvider;
  upload(file: File, config: ProviderConfig, options?: UploadOptions): Promise<UploadResult>;
  uploadMultiple(files: File[], config: ProviderConfig, options?: UploadOptions): Promise<UploadResult[]>;
  validate(file: File, validationOptions?: FileValidationOptions): ValidationResult | Promise<ValidationResult>;
}

export interface UploadError extends Error {
  code: string;
  provider: UploadProvider;
  details?: unknown;
}
