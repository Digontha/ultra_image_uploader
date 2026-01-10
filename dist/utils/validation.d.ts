/**
 * Validation utilities for image uploads
 */
import type { FileValidationOptions, ValidationResult } from '../types';
export declare function validateImageFile(file: File, options?: FileValidationOptions): ValidationResult;
export declare function validateImageDimensions(file: File, options?: FileValidationOptions): Promise<ValidationResult>;
export declare function validateFileComplete(file: File, options?: FileValidationOptions): Promise<ValidationResult>;
export declare function formatFileSize(bytes: number): string;
export declare function getFileExtension(filename: string): string;
export declare function isImageFile(file: File): boolean;
//# sourceMappingURL=validation.d.ts.map