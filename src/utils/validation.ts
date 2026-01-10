/**
 * Validation utilities for image uploads
 */

import type { FileValidationOptions, ValidationResult, ValidationError } from '../types';

const DEFAULT_VALIDATION_OPTIONS: Required<FileValidationOptions> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  minWidth: 1,
  maxWidth: 10000,
  minHeight: 1,
  maxHeight: 10000,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
};

export function validateImageFile(
  file: File,
  options: FileValidationOptions = {}
): ValidationResult {
  const opts = { ...DEFAULT_VALIDATION_OPTIONS, ...options };
  const errors: ValidationError[] = [];

  // Check file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    errors.push({
      code: 'INVALID_TYPE',
      message: `File type "${file.type}" is not allowed. Allowed types: ${opts.allowedTypes.join(', ')}`,
      field: 'type',
    });
  }

  // Check file size
  if (opts.maxSize && file.size > opts.maxSize) {
    const maxSizeMB = (opts.maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    errors.push({
      code: 'FILE_TOO_LARGE',
      message: `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
      field: 'size',
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function validateImageDimensions(
  file: File,
  options: FileValidationOptions = {}
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const opts = { ...DEFAULT_VALIDATION_OPTIONS, ...options };
    const errors: ValidationError[] = [];

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Check width
      if (opts.minWidth && img.width < opts.minWidth) {
        errors.push({
          code: 'IMAGE_TOO_NARROW',
          message: `Image width (${img.width}px) is less than minimum required (${opts.minWidth}px)`,
          field: 'width',
        });
      }
      if (opts.maxWidth && img.width > opts.maxWidth) {
        errors.push({
          code: 'IMAGE_TOO_WIDE',
          message: `Image width (${img.width}px) exceeds maximum allowed (${opts.maxWidth}px)`,
          field: 'width',
        });
      }

      // Check height
      if (opts.minHeight && img.height < opts.minHeight) {
        errors.push({
          code: 'IMAGE_TOO_SHORT',
          message: `Image height (${img.height}px) is less than minimum required (${opts.minHeight}px)`,
          field: 'height',
        });
      }
      if (opts.maxHeight && img.height > opts.maxHeight) {
        errors.push({
          code: 'IMAGE_TOO_TALL',
          message: `Image height (${img.height}px) exceeds maximum allowed (${opts.maxHeight}px)`,
          field: 'height',
        });
      }

      resolve({
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        errors: [
          {
            code: 'INVALID_IMAGE',
            message: 'Failed to load image for validation',
            field: 'dimensions',
          },
        ],
      });
    };

    img.src = url;
  });
}

export async function validateFileComplete(
  file: File,
  options: FileValidationOptions = {}
): Promise<ValidationResult> {
  const basicValidation = validateImageFile(file, options);

  if (!basicValidation.valid) {
    return basicValidation;
  }

  const dimensionValidation = await validateImageDimensions(file, options);

  return {
    valid: dimensionValidation.valid,
    errors: [
      ...(basicValidation.errors || []),
      ...(dimensionValidation.errors || []),
    ],
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
