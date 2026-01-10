"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import type { UploadProvider, ProviderConfig } from "../types";
import { uploadImage } from "../providers";
import { isImageFile, formatFileSize } from "../utils/validation";

// Theme definitions - shadcn/ui inspired
export const themes = {
  nature: {
    name: "Nature",
    colors: {
      primary: "#16a34a",
      primaryHover: "#15803d",
      background: "#f0fdf4",
      border: "#bbf7d0",
      text: "#14532d",
      textSecondary: "#166534",
      cardBg: "#ffffff",
      cardBorder: "#dcfce7",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  },
  modern: {
    name: "Modern",
    colors: {
      primary: "#09090b",
      primaryHover: "#18181b",
      background: "#fafafa",
      border: "#e4e4e7",
      text: "#18181b",
      textSecondary: "#71717a",
      cardBg: "#ffffff",
      cardBorder: "#e4e4e7",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  },
  fresh: {
    name: "Fresh",
    colors: {
      primary: "#0284c7",
      primaryHover: "#0369a1",
      background: "#f0f9ff",
      border: "#bae6fd",
      text: "#0c4a6e",
      textSecondary: "#075985",
      cardBg: "#ffffff",
      cardBorder: "#e0f2fe",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  },
  dark: {
    name: "Dark",
    colors: {
      primary: "#3b82f6",
      primaryHover: "#2563eb",
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      border: "#334155",
      text: "#f8fafc",
      textSecondary: "#94a3b8",
      cardBg: "#1e293b",
      cardBorder: "#334155",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
    },
  },
  ocean: {
    name: "Ocean",
    colors: {
      primary: "#06b6d4",
      primaryHover: "#0891b2",
      background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
      border: "#7dd3fc",
      text: "#f0f9ff",
      textSecondary: "#bae6fd",
      cardBg: "#0c4a6e",
      cardBorder: "#0369a1",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2)",
    },
  },
};

export type ThemeName = keyof typeof themes;
export type CustomTheme = (typeof themes)[ThemeName];

export interface ImageUploaderProps {
  // Core props
  images: File[];
  setImages: (images: File[]) => void;

  // Mode
  mode?: "add" | "update";
  defaultImages?: string[];

  // File constraints
  multiple?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  maxImages?: number;

  // Upload configuration
  uploadConfig?: {
    provider: UploadProvider;
    config: ProviderConfig;
  };
  autoUpload?: boolean;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;

  // Theme & styling
  theme?: ThemeName;
  customTheme?: CustomTheme;
  showThemeSelector?: boolean;

  // Customization
  previewSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
  containerClassName?: string;

  // UI toggles
  showImageCount?: boolean;
  showFileSize?: boolean;
  showFileName?: boolean;

  // Custom button support
  customUploadButton?: React.ReactNode;
  hideDefaultUploadArea?: boolean;
  onUploadClick?: () => void;
}

interface FileWithProgress extends File {
  progress?: number;
  status?: "pending" | "uploading" | "done" | "error";
  error?: string;
  preview?: string;
}

const borderRadiusMap = {
  none: "0",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
};

export function ImageUploader({
  images,
  setImages,
  mode = "add",
  defaultImages = [],
  multiple = true,
  maxSize = 50 * 1024 * 1024,
  allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
  maxImages = 20,
  uploadConfig,
  autoUpload = false,
  onUploadComplete,
  onUploadError,
  theme = "nature",
  customTheme,
  showThemeSelector = false,
  previewSize = "lg",
  borderRadius = "md",
  className = "",
  containerClassName = "max-w-5xl mx-auto mt-10",
  showImageCount = true,
  showFileSize = true,
  showFileName = true,
  customUploadButton,
  hideDefaultUploadArea = false,
  onUploadClick,
}: ImageUploaderProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(theme);
  const [isDragging, setIsDragging] = useState(false);
  const [fileStates, setFileStates] = useState<Map<string, FileWithProgress>>(
    new Map()
  );
  const [uploading, setUploading] = useState(false);
  const [removedDefaults, setRemovedDefaults] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const currentTheme = customTheme || themes[selectedTheme];
  const t = currentTheme.colors;
  const radius = borderRadiusMap[borderRadius];

  // Generate previews
  useEffect(() => {
    const newStates = new Map<string, FileWithProgress>();
    images.forEach((file) => {
      const key = `${file.name}-${file.size}`;
      const existing = fileStates.get(key);

      if (existing?.preview) {
        newStates.set(key, existing);
      } else {
        const preview = isImageFile(file)
          ? URL.createObjectURL(file)
          : undefined;
        newStates.set(key, {
          ...file,
          progress: 0,
          status: "pending",
          preview,
        });
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

  // Validate upload config
  const validateUploadConfig = useCallback((): string | null => {
    if (!uploadConfig) return null;

    if (uploadConfig.provider === "imgbb") {
      if (!uploadConfig.config.apiKey) {
        return "ImgBB API key is missing. Please provide a valid API key in the uploadConfig.";
      }
      if (uploadConfig.config.apiKey.trim() === "") {
        return "ImgBB API key cannot be empty.";
      }
    }

    if (uploadConfig.provider === "cloudinary") {
      if (!uploadConfig.config.cloudName) {
        return "Cloudinary cloud name is missing. Please provide a valid cloud name in the uploadConfig.";
      }
      if (uploadConfig.config.cloudName.trim() === "") {
        return "Cloudinary cloud name cannot be empty.";
      }
    }

    return null;
  }, [uploadConfig]);

  const handleAutoUpload = async () => {
    if (!uploadConfig) return;

    // Validate config before upload
    const validationError = validateUploadConfig();
    if (validationError) {
      setError(validationError);
      onUploadError?.(new Error(validationError));
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const results = await Promise.all(
        images.map(async (file) => {
          const key = `${file.name}-${file.size}`;
          setFileStates((prev) => {
            const next = new Map(prev);
            next.set(key, { ...file, progress: 0, status: "uploading" });
            return next;
          });

          const result = await uploadImage(
            file,
            uploadConfig.provider,
            uploadConfig.config,
            {
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
            }
          );

          setFileStates((prev) => {
            const next = new Map(prev);
            const current = next.get(key);
            if (current) {
              next.set(key, { ...current, progress: 100, status: "done" });
            }
            return next;
          });

          return result;
        })
      );

      const urls = results.map((r) => r.url);
      onUploadComplete?.(urls);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      onUploadError?.(err instanceof Error ? err : new Error(errorMessage));
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
        alert("Only one file allowed");
        return;
      }

      setImages(multiple ? [...images, ...valid] : [valid[0]]);
    },
    [images, multiple, setImages, validateFiles, maxImages]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    onUploadClick?.();
    fileInputRef.current?.click();
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

  const removeDefaultImage = (index: number) => {
    setRemovedDefaults((prev) => [...prev, index]);
  };

  const getFileState = (file: File): FileWithProgress => {
    const key = `${file.name}-${file.size}`;
    return fileStates.get(key) || { ...file, progress: 0, status: "pending" };
  };

  return (
    <div className={`image-uploader ${containerClassName} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-semibold tracking-tight"
            style={{ color: t.text }}
          >
            {mode === "update" ? "Update" : "Upload"} Images
          </h2>
          <p className="text-sm" style={{ color: t.textSecondary }}>
            {multiple
              ? "Drag and drop or click to upload"
              : "Select an image to upload"}
          </p>
        </div>

        {showImageCount && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border"
            style={{
              backgroundColor: t.cardBg,
              borderColor: t.cardBorder,
              color: t.text,
            }}
          >
            <span>{images.length}</span>
            {maxImages && (
              <span className="text-muted" style={{ color: t.textSecondary }}>
                / {maxImages}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-4 rounded-md border flex items-start gap-3"
          style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
        >
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5"
              style={{ color: "#dc2626" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "#991b1b" }}>
              Upload Error
            </p>
            <p className="text-sm mt-1" style={{ color: "#b91c1c" }}>
              {error}
            </p>
          </div>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ color: "#991b1b" }}
            aria-label="Dismiss error"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Theme Selector */}
      {showThemeSelector && (
        <div
          className="mb-6 inline-flex gap-1 p-1 rounded-lg border"
          style={{ backgroundColor: t.background, borderColor: t.cardBorder }}
        >
          {(Object.keys(themes) as ThemeName[]).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTheme(key)}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              style={{
                backgroundColor:
                  selectedTheme === key ? t.cardBg : "transparent",
                color: selectedTheme === key ? t.text : t.textSecondary,
              }}
            >
              {themes[key].name}
            </button>
          ))}
        </div>
      )}

      {/* Custom Upload Button */}
      {customUploadButton && (
        <div className="mb-4">
          <div onClick={handleUploadClick}>{customUploadButton}</div>
        </div>
      )}

      {/* Hidden File Input (always present for custom button) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        style={{ display: "none" }}
      />

      {/* Default Upload Area */}
      {!hideDefaultUploadArea && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload images"
          className="relative group cursor-pointer overflow-hidden transition-all duration-200"
          style={{
            borderRadius: radius,
            border: `2px dashed ${isDragging ? t.primary : t.cardBorder}`,
            backgroundColor: t.background,
          }}
          onClick={handleUploadClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleUploadClick();
            }
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-8">
            <div
              className="mb-4 flex items-center justify-center transition-transform duration-200"
              style={{ color: isDragging ? t.primary : t.textSecondary }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width:
                    previewSize === "2xl"
                      ? "96px"
                      : previewSize === "xl"
                      ? "80px"
                      : previewSize === "lg"
                      ? "64px"
                      : previewSize === "md"
                      ? "56px"
                      : previewSize === "sm"
                      ? "48px"
                      : "20px",
                  height:
                    previewSize === "2xl"
                      ? "96px"
                      : previewSize === "xl"
                      ? "80px"
                      : previewSize === "lg"
                      ? "64px"
                      : previewSize === "md"
                      ? "56px"
                      : previewSize === "sm"
                      ? "48px"
                      : "20px",
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.cardBorder}`,
                }}
              >
                <ImageIcon size={24} />
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-medium" style={{ color: t.text }}>
                {isDragging ? "Drop here" : "Click or drop to upload"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {(images.length > 0 || defaultImages.length > 0) && (
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Default Images (Update Mode) */}
            {mode === "update" &&
              defaultImages.map(
                (url, index) =>
                  !removedDefaults.includes(index) && (
                    <div
                      key={`default-${index}`}
                      className="relative group aspect-square"
                      style={{ animation: "fadeIn 0.2s ease-out" }}
                    >
                      <div
                        className="relative w-full h-full overflow-hidden border transition-all duration-200 hover:shadow-md"
                        style={{
                          borderRadius: radius,
                          borderColor: t.cardBorder,
                          backgroundColor: t.cardBg,
                        }}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Remove Button */}
                        <button
                          onClick={() => removeDefaultImage(index)}
                          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-80"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(4px)",
                            zIndex: 10,
                          }}
                          aria-label="Remove image"
                        >
                          <Trash2 size={14} className="text-white" />
                        </button>
                      </div>
                    </div>
                  )
              )}

            {/* Uploaded Images */}
            {images.map((file, index) => {
              const state = getFileState(file);
              const isUploading = state.status === "uploading";
              const isDone = state.status === "done";

              return (
                <div
                  key={`${file.name}-${file.size}`}
                  className="relative group aspect-square"
                  style={{
                    animation: "fadeIn 0.2s ease-out",
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  <div
                    className="relative w-full h-full overflow-hidden border transition-all duration-200 hover:shadow-md"
                    style={{
                      borderRadius: radius,
                      borderColor: t.cardBorder,
                      backgroundColor: t.cardBg,
                    }}
                  >
                    {state.preview ? (
                      <img
                        src={state.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: t.border }}
                      >
                        <ImageIcon size={32} style={{ color: t.primary }} />
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-80"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(4px)",
                        zIndex: 10,
                      }}
                      aria-label="Remove image"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>

                    {/* Progress Overlay */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <Loader2
                            size={24}
                            className="animate-spin text-white mx-auto mb-2"
                          />
                          <p className="text-white text-xs font-medium">
                            {state.progress}%
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Done Indicator */}
                    {isDone && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div
                          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                          style={{
                            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
                          }}
                        >
                          <svg
                            className="w-6 h-6 text-white"
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
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  {(showFileName || showFileSize) && (
                    <div className="mt-2 space-y-0.5">
                      {showFileName && (
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: t.text }}
                        >
                          {file.name}
                        </p>
                      )}
                      {showFileSize && (
                        <p
                          className="text-xs"
                          style={{ color: t.textSecondary }}
                        >
                          {formatFileSize(file.size)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {images.length > 0 && !autoUpload && uploadConfig && (
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={handleAutoUpload}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium rounded-md text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            style={{
              backgroundColor: t.primary,
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {images.length}{" "}
                {images.length === 1 ? "image" : "images"}
              </>
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
