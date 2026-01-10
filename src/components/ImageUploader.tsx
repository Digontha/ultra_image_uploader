'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import type { UploadProvider, ProviderConfig } from '../types';
import { uploadImage } from '../providers';
import { isImageFile, formatFileSize } from '../utils/validation';

export interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
  multiple?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  uploadText?: string;
  className?: string;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
  autoUpload?: boolean;
  uploadConfig?: {
    provider: UploadProvider;
    config: ProviderConfig;
  };
}

interface FileWithProgress extends File {
  progress?: number;
  status?: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export function ImageUploader({
  images,
  setImages,
  multiple = true,
  maxSize = 50 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  className = '',
  onUploadComplete,
  onUploadError,
  autoUpload = false,
  uploadConfig,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileStates, setFileStates] = useState<Map<string, FileWithProgress>>(new Map());
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Initialize file states
  useEffect(() => {
    const newStates = new Map<string, FileWithProgress>();
    images.forEach((file) => {
      const key = `${file.name}-${file.size}`;
      if (!fileStates.has(key)) {
        newStates.set(key, { ...file, progress: 0, status: 'pending' });
      } else {
        newStates.set(key, fileStates.get(key)!);
      }
    });
    setFileStates(newStates);
  }, [images]);

  // Auto upload effect
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
        images.map(async (file) => {
          const key = `${file.name}-${file.size}`;
          setFileStates((prev) => {
            const next = new Map(prev);
            next.set(key, { ...file, progress: 0, status: 'uploading' });
            return next;
          });

          const result = await uploadImage(file, uploadConfig.provider, uploadConfig.config, {
            onProgress: (p) => {
              setFileStates((prev) => {
                const next = new Map(prev);
                const current = next.get(key);
                if (current) {
                  next.set(key, { ...current, progress: p.percentage });
                }
                return next;
              });
            },
          });

          setFileStates((prev) => {
            const next = new Map(prev);
            const current = next.get(key);
            if (current) {
              next.set(key, { ...current, progress: 100, status: 'done' });
            }
            return next;
          });

          return result;
        })
      );

      const urls = results.map((r) => r.url);
      onUploadComplete?.(urls);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      onUploadError?.(error);
    } finally {
      setUploading(false);
    }
  };

  const validateFiles = useCallback(
    (files: FileList): { valid: File[]; invalid: File[] } => {
      const valid: File[] = [];
      const invalid: File[] = [];

      Array.from(files).forEach((file) => {
        if (!isImageFile(file)) {
          invalid.push(file);
          return;
        }
        if (file.size > maxSize) {
          invalid.push(file);
          return;
        }
        if (!allowedTypes.includes(file.type)) {
          invalid.push(file);
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
      const { valid } = validateFiles(files);

      if (valid.length === 0) return;

      if (!multiple && valid.length > 1) {
        alert('Only one file allowed');
        return;
      }

      setImages(multiple ? [...images, ...valid] : [valid[0]]);
    },
    [images, multiple, setImages, validateFiles]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items?.length) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (file: File) => {
    setImages(images.filter((f) => f !== file));
  };

  const getFileState = (file: File): FileWithProgress => {
    const key = `${file.name}-${file.size}`;
    return fileStates.get(key) || { ...file, progress: 0, status: 'pending' };
  };

  return (
    <div className={`image-uploader ${className}`}>
      {/* Upload Area */}
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 transition-colors duration-200"
        style={{
          borderColor: isDragging ? '#1E88E5' : undefined,
          backgroundColor: isDragging ? '#F5F5F5' : 'white',
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
              <FileText size={32} className="text-gray-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <Upload size={16} className="text-white" />
            </div>
          </div>

          <p className="text-base text-gray-700 mb-2">
            <span className="underline decoration-1 underline-offset-2 cursor-pointer hover:text-gray-900">
              Click to upload
            </span>{' '}
            or drag and drop
          </p>

          <p className="text-sm text-gray-500">Maximum file size {formatFileSize(maxSize)}</p>
        </div>
      </div>

      {/* File List */}
      {images.length > 0 && (
        <div className="mt-6 space-y-4">
          {images.map((file) => {
            const state = getFileState(file);
            const isUploading = state.status === 'uploading';
            const isDone = state.status === 'done';

            return (
              <div
                key={`${file.name}-${file.size}`}
                className="border border-gray-300 rounded-lg p-4 transition-all duration-200 hover:border-gray-400"
              >
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-gray-500" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>

                    {/* Progress Bar */}
                    {isUploading || isDone ? (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${state.progress || 0}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {state.progress || 0}%
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file);
                    }}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      {images.length > 0 && !autoUpload && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setImages([])}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAutoUpload}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              'Attach files'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
