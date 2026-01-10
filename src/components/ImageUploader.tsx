"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import type { UploadProvider, ProviderConfig } from '../types';
import { uploadImage } from '../utils/upload';
import { isImageFile, formatFileSize } from '../utils/validation';

/**
 * Theme configuration for the uploader
 */
export interface UploaderTheme {
  primary?: string;
  primaryHover?: string;
  background?: string;
  border?: string;
  text?: string;
  textSecondary?: string;
  error?: string;
  success?: string;
  radius?: string;
}

export type ThemePreset = 'light' | 'dark' | 'modern' | 'minimal' | 'colorful';

const THEME_PRESETS: Record<ThemePreset, UploaderTheme> = {
  light: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#1f2937',
    textSecondary: '#6b7280',
    error: '#ef4444',
    success: '#10b981',
    radius: '0.5rem',
  },
  dark: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    background: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    error: '#f87171',
    success: '#34d399',
    radius: '0.5rem',
  },
  modern: {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    background: '#faf5ff',
    border: '#e9d5ff',
    text: '#581c87',
    textSecondary: '#7c3aed',
    error: '#dc2626',
    success: '#059669',
    radius: '1rem',
  },
  minimal: {
    primary: '#000000',
    primaryHover: '#333333',
    background: '#ffffff',
    border: '#000000',
    text: '#000000',
    textSecondary: '#666666',
    error: '#dc2626',
    success: '#059669',
    radius: '0',
  },
  colorful: {
    primary: '#f59e0b',
    primaryHover: '#d97706',
    background: '#fffbeb',
    border: '#fcd34d',
    text: '#78350f',
    textSecondary: '#92400e',
    error: '#ef4444',
    success: '#10b981',
    radius: '0.75rem',
  },
};

/**
 * Props for the ImageUploader component
 */
export interface ImageUploaderProps {
  /** Currently selected image files */
  images: File[];
  /** Function to update the images array */
  setImages: (images: File[]) => void;
  /** Operation mode */
  mode?: 'add' | 'update';
  /** Existing image URLs for update mode */
  defaultImages?: string[];
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Upload area text */
  uploadText?: string;
  /** File type hint text */
  typeText?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Allowed file types */
  allowedTypes?: string[];
  /** Theme preset */
  theme?: ThemePreset;
  /** Custom theme object */
  customTheme?: UploaderTheme;
  /** Show file size preview */
  showFileSize?: boolean;
  /** Enable drag and drop */
  dragAndDrop?: boolean;
  /** Image preview width */
  previewWidth?: number;
  /** Image preview height */
  previewHeight?: number;
  /** Callback when upload completes */
  onUploadComplete?: (urls: string[]) => void;
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void;
  /** Auto upload on file selection */
  autoUpload?: boolean;
  /** Upload provider configuration */
  uploadConfig?: {
    provider: UploadProvider;
    config: ProviderConfig;
  };
}

interface UploadProgress {
  [key: string]: number;
}

interface FileWithError extends File {
  error?: string;
}

export function ImageUploader({
  images,
  setImages,
  mode = 'add',
  defaultImages = [],
  multiple = false,
  className = '',
  uploadText = 'Drop images here or click to browse',
  typeText = 'PNG, JPG, JPEG, WEBP, GIF up to 10MB',
  maxSize = 10 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  theme = 'light',
  customTheme,
  showFileSize = true,
  dragAndDrop = true,
  previewWidth = 150,
  previewHeight = 150,
  onUploadComplete,
  onUploadError,
  autoUpload = false,
  uploadConfig,
}: ImageUploaderProps) {
  const [removedDefaultImages, setRemovedDefaultImages] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [uploading, setUploading] = useState(false);
  const [filesWithErrors, setFilesWithErrors] = useState<FileWithError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const currentTheme = { ...THEME_PRESETS[theme], ...customTheme };

  useEffect(() => {
    if (autoUpload && uploadConfig && images.length > 0 && !uploading) {
      handleAutoUpload();
    }
  }, [images]);

  const handleAutoUpload = async () => {
    if (!uploadConfig) return;

    setUploading(true);
    try {
      const results = await Promise.all(
        images.map((file) =>
          uploadImage(file, uploadConfig.provider, uploadConfig.config, {
            onProgress: (progress) => {
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress.percentage,
              }));
            },
          })
        )
      );

      const urls = results.map((r) => r.url);
      onUploadComplete?.(urls);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed');
      onUploadError?.(err);
      setFilesWithErrors((prev) => [...prev, { ...images[0], error: err.message }]);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const validateFiles = useCallback(
    (files: FileList): { valid: File[]; invalid: FileWithError[] } => {
      const valid: File[] = [];
      const invalid: FileWithError[] = [];

      Array.from(files).forEach((file) => {
        if (!isImageFile(file)) {
          invalid.push({ ...file, error: 'Not an image file' });
          return;
        }

        if (file.size > maxSize) {
          invalid.push({ ...file, error: `File too large (max ${formatFileSize(maxSize)})` });
          return;
        }

        if (!allowedTypes.includes(file.type)) {
          invalid.push({ ...file, error: 'File type not allowed' });
          return;
        }

        valid.push(file);
      });

      return { valid, invalid };
    },
    [maxSize, allowedTypes]
  );

  const handleFiles = useCallback(
    (files: FileList) => {
      const { valid, invalid } = validateFiles(files);

      if (invalid.length > 0) {
        setFilesWithErrors((prev) => [...prev, ...invalid]);
      }

      if (valid.length === 0) {
        return;
      }

      if (!multiple && valid.length > 1) {
        alert('Only one image can be uploaded at a time in single mode');
        return;
      }

      setImages(multiple ? [...images, ...valid] : [valid[0]]);
    },
    [images, multiple, setImages, validateFiles]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!dragAndDrop) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!dragAndDrop) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!dragAndDrop) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!dragAndDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeDefaultImage = (index: number) => {
    setRemovedDefaultImages((prev) => [...prev, index]);
  };

  const dismissError = (index: number) => {
    setFilesWithErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAreaStyle: React.CSSProperties = {
    backgroundColor: isDragging
      ? `${currentTheme.primary}20`
      : currentTheme.background,
    border: `2px dashed ${isDragging ? currentTheme.primary : currentTheme.border}`,
    borderRadius: currentTheme.radius,
    transition: 'all 0.3s ease',
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Error Messages */}
      {filesWithErrors.length > 0 && (
        <div className="space-y-2">
          {filesWithErrors.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{
                backgroundColor: `${currentTheme.error}10`,
                border: `1px solid ${currentTheme.error}30`,
              }}
            >
              <AlertCircle size={20} style={{ color: currentTheme.error }} />
              <span className="flex-1 text-sm" style={{ color: currentTheme.text }}>
                <strong>{file.name}</strong>: {file.error}
              </span>
              <button
                onClick={() => dismissError(idx)}
                className="p-1 hover:opacity-70"
                style={{ color: currentTheme.textSecondary }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative h-48 w-full flex justify-center items-center text-center cursor-pointer ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
        style={uploadAreaStyle}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: `${currentTheme.primary}10` }}
          >
            {uploading ? (
              <Loader2
                size={32}
                className="animate-spin"
                style={{ color: currentTheme.primary }}
              />
            ) : (
              <Upload size={32} style={{ color: currentTheme.primary }} />
            )}
          </div>
          <span
            className="text-base font-semibold"
            style={{ color: currentTheme.text }}
          >
            {uploadText}
          </span>
          <span className="text-sm" style={{ color: currentTheme.textSecondary }}>
            {typeText}
          </span>
          {uploading && (
            <span className="text-sm" style={{ color: currentTheme.primary }}>
              Uploading...
            </span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          multiple={multiple}
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      {/* Images Grid */}
      <div className="flex flex-wrap gap-4">
        {/* Default Images (Update Mode) */}
        {mode === 'update' &&
          defaultImages.map(
            (url, index) =>
              !removedDefaultImages.includes(index) && (
                <div
                  key={`default-${index}`}
                  className="relative group"
                  style={{ width: `${previewWidth}px` }}
                >
                  <img
                    src={url}
                    alt={`Existing ${index + 1}`}
                    width={previewWidth}
                    height={previewHeight}
                    className="object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                    style={{
                      borderRadius: currentTheme.radius,
                      height: `${previewHeight}px`,
                    }}
                  />
                  <button
                    onClick={() => removeDefaultImage(index)}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: currentTheme.error }}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              )
          )}

        {/* Uploaded Images */}
        {images.map((image, index) => {
          const progress = uploadProgress[image.name];
          return (
            <div
              key={index}
              className="relative group"
              style={{ width: `${previewWidth}px` }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                width={previewWidth}
                height={previewHeight}
                className="object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                style={{
                  borderRadius: currentTheme.radius,
                  height: `${previewHeight}px`,
                }}
              />
              {progress !== undefined && progress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <span className="text-white font-semibold">{progress}%</span>
                </div>
              )}
              {showFileSize && (
                <div
                  className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: `${currentTheme.background}90`,
                    color: currentTheme.text,
                  }}
                >
                  {formatFileSize(image.size)}
                </div>
              )}
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: currentTheme.error }}
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {images.length === 0 && defaultImages.filter((_, i) => !removedDefaultImages.includes(i)).length === 0 && (
        <div className="flex items-center justify-center gap-2 py-8" style={{ color: currentTheme.textSecondary }}>
          <ImageIcon size={20} />
          <span className="text-sm">No images selected</span>
        </div>
      )}
    </div>
  );
}
