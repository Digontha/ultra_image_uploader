'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, File, Moon, Sun, GripVertical } from 'lucide-react';
import type { UploadProvider, ProviderConfig } from '../types';
import { uploadImage } from '../providers';
import { isImageFile, formatFileSize } from '../utils/validation';

export interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
  multiple?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  maxImages?: number;
  className?: string;
  containerClassName?: string;
  uploadText?: string;
  dragText?: string;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  showThemeToggle?: boolean;
  showImageCount?: boolean;
  enableReorder?: boolean;
  gridCols?: number;
  cardClassName?: string;
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
  preview?: string;
}

export function ImageUploader({
  images,
  setImages,
  multiple = true,
  maxSize = 50 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  maxImages = 20,
  className = '',
  containerClassName = 'max-w-5xl mx-auto',
  uploadText = 'Click or drag to upload images',
  dragText = 'Drop images here',
  theme: externalTheme,
  onThemeChange,
  showThemeToggle = true,
  showImageCount = true,
  enableReorder = true,
  gridCols = 4,
  cardClassName = '',
  onUploadComplete,
  onUploadError,
  autoUpload = false,
  uploadConfig,
}: ImageUploaderProps) {
  const [internalTheme, setInternalTheme] = useState<'light' | 'dark'>('light');
  const [isDragging, setIsDragging] = useState(false);
  const [fileStates, setFileStates] = useState<Map<string, FileWithProgress>>(new Map());
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const theme = externalTheme || internalTheme;
  const isDark = theme === 'dark';

  const handleThemeToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setInternalTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  // Generate previews
  useEffect(() => {
    const newStates = new Map<string, FileWithProgress>();
    images.forEach((file) => {
      const key = `${file.name}-${file.size}`;
      const existing = fileStates.get(key);

      if (existing?.preview) {
        newStates.set(key, existing);
      } else {
        const preview = isImageFile(file) ? URL.createObjectURL(file) : undefined;
        newStates.set(key, { ...file, progress: 0, status: 'pending', preview });
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
        if (!isImageFile(file) && !allowedTypes.includes(file.type)) {
          invalid.push(file);
          return;
        }
        if (file.size > maxSize) {
          invalid.push(file);
          return;
        }
        if (maxImages && images.length + valid.length >= maxImages) {
          return;
        }
        valid.push(file);
      });

      return { valid, invalid };
    },
    [maxSize, allowedTypes, maxImages, images.length]
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
    [images, multiple, setImages, validateFiles, maxImages]
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

  const removeFile = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!enableReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    if (!enableReorder || draggedIndex === null || draggedIndex === index) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropItem = (e: React.DragEvent, index: number) => {
    if (!enableReorder || draggedIndex === null || draggedIndex === index) return;
    e.preventDefault();

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getFileState = (file: File): FileWithProgress => {
    const key = `${file.name}-${file.size}`;
    return fileStates.get(key) || { ...file, progress: 0, status: 'pending' };
  };

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[gridCols] || 'grid-cols-4';

  return (
    <div className={`image-uploader ${containerClassName} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Upload Images
        </h2>
        {showImageCount && (
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {images.length} {maxImages ? `/ ${maxImages}` : ''} images
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : isDark
            ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        style={{
          boxShadow: isDark
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        onFocus={(e) => e.currentTarget.classList.add('ring-2', 'ring-blue-500')}
        onBlur={(e) => e.currentTarget.classList.remove('ring-2', 'ring-blue-500')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          style={{ zIndex: 10 }}
        />

        <div className="flex flex-col items-center justify-center p-12">
          <div
            className={`relative mb-4 transition-transform duration-300 ${
              isDragging ? 'scale-110' : 'scale-100'
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-white'
              }`}
              style={{
                boxShadow: isDark
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ImageIcon
                size={40}
                className={isDark ? 'text-gray-400' : 'text-gray-500'}
              />
            </div>
            <div
              className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'scale-125' : 'scale-100'
              } ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Upload size={20} className="text-white" />
            </div>
          </div>

          <p
            className={`text-lg font-semibold mb-2 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {isDragging ? dragText : uploadText}
          </p>

          <p
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Maximum file size {formatFileSize(maxSize)}
          </p>

          {maxImages && (
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Up to {maxImages} images
            </p>
          )}
        </div>
      </div>

      {/* Theme Toggle */}
      {showThemeToggle && !externalTheme && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleThemeToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-medium">
              {isDark ? 'Light' : 'Dark'} Mode
            </span>
          </button>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="mt-8">
          <div
            className={`grid gap-4 ${gridColsClass} ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {images.map((file, index) => {
              const state = getFileState(file);
              const isUploading = state.status === 'uploading';
              const isDone = state.status === 'done';

              return (
                <div
                  key={`${file.name}-${file.size}`}
                  draggable={enableReorder}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOverItem(e, index)}
                  onDrop={(e) => handleDropItem(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative ${cardClassName} ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-750'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    style={{
                      boxShadow: isDark
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Reorder Handle */}
                    {enableReorder && (
                      <div
                        className={`absolute top-2 left-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 ${
                          isDark ? 'bg-gray-700' : 'bg-white'
                        }`}
                        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                      >
                        <GripVertical size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 bg-red-500 hover:bg-red-600 text-white"
                      style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                    >
                      <X size={16} />
                    </button>

                    {/* Preview */}
                    <div className="relative aspect-square">
                      {state.preview ? (
                        <img
                          src={state.preview}
                          alt={file.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <File
                            size={48}
                            className={isDark ? 'text-gray-500' : 'text-gray-400'}
                          />
                        </div>
                      )}

                      {/* Progress Overlay */}
                      {(isUploading || isDone) && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center">
                            {isUploading ? (
                              <>
                                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-white font-semibold">{state.progress}%</p>
                              </>
                            ) : (
                              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-3">
                      <p
                        className={`text-sm font-medium truncate mb-1 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {file.name}
                      </p>
                      <p
                        className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {formatFileSize(file.size)}
                      </p>

                      {/* Progress Bar (Thumbnail) */}
                      {isUploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${state.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {images.length > 0 && !autoUpload && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setImages([])}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
            }`}
          >
            Clear All
          </button>
          <button
            onClick={handleAutoUpload}
            disabled={uploading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {images.length} {images.length === 1 ? 'Image' : 'Images'}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
