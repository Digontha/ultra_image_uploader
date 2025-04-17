"use client";
import { TrashIcon, UploadCloudIcon } from "lucide-react";
import { useState, useCallback } from "react";

interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
  mode: "add" | "update";
  defaultImages?: string[];
  multiple?: boolean;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[]; // e.g., ["image/jpeg", "image/png"]
  containerClassName?: string;
  uploadBoxClassName?: string;
  imageClassName?: string;
  uploadBoxStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  uploadIcon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  uploadText?: string;
  dragAndDropText?: string;
  fileTypeText?: string;
  onUpload?: (files: File[]) => void;
  onRemove?: (file: File, index: number) => void;
  onFileValidationError?: (error: string) => void;
}

export function ImageUploader({
  images,
  setImages,
  mode,
  defaultImages = [],
  multiple = false,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  allowedFileTypes = ["image/jpeg", "image/png"],
  containerClassName = "",
  uploadBoxClassName = "",
  imageClassName = "",
  uploadBoxStyle = {},
  imageStyle = {},
  uploadIcon = <UploadCloudIcon className="w-12 h-12 text-blue-500 mb-2" />,
  deleteIcon = (
    <div className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full shadow-lg transform transition-transform hover:scale-110">
      <TrashIcon className="w-4 h-4 text-white" />
    </div>
  ),
  uploadText = "Choose files to upload",
  dragAndDropText = "or drag and drop files here",
  fileTypeText = "PNG, JPG, or JPEG files up to 5MB",
  onUpload,
  onRemove,
  onFileValidationError,
}: ImageUploaderProps) {
  const [removedDefaultImages, setRemovedDefaultImages] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      const validFiles = files.filter((file) => {
        if (!allowedFileTypes.includes(file.type)) {
          onFileValidationError?.(`File type not allowed: ${file.name}`);
          return false;
        }
        if (file.size > maxFileSize) {
          onFileValidationError?.(`File too large: ${file.name}`);
          return false;
        }
        return true;
      });

      if (!multiple && validFiles.length > 1) {
        alert("Only one image can be uploaded at a time.");
        return;
      }

      setImages(multiple ? [...images, ...validFiles] : [validFiles[0]]);
      onUpload?.(validFiles);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);

      const validFiles = files.filter((file) => {
        if (!allowedFileTypes.includes(file.type)) {
          onFileValidationError?.(`File type not allowed: ${file.name}`);
          return false;
        }
        if (file.size > maxFileSize) {
          onFileValidationError?.(`File too large: ${file.name}`);
          return false;
        }
        return true;
      });

      if (!multiple && validFiles.length > 1) {
        alert("Only one image can be uploaded at a time.");
        return;
      }

      setImages(multiple ? [...images, ...validFiles] : [validFiles[0]]);
      onUpload?.(validFiles);
    },
    [
      images,
      multiple,
      setImages,
      allowedFileTypes,
      maxFileSize,
      onFileValidationError,
      onUpload,
    ]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (index: number) => {
    const removedFile = images[index];
    onRemove?.(removedFile, index);
    setImages(images.filter((_, i) => i !== index));
  };

  const removeDefaultImage = (index: number) => {
    setRemovedDefaultImages((prev) => [...prev, index]);
  };

  return (
    <div className={`space-y-4 ${containerClassName}`}>
      <div
        className={`
          relative rounded-lg transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${uploadBoxClassName || 'border-2 border-dashed p-8'}
        `}
        style={uploadBoxStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {uploadIcon}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">{uploadText}</p>
            <p className="text-sm text-gray-500">{dragAndDropText}</p>
            <p className="text-xs text-gray-400">{fileTypeText}</p>
          </div>
          <input
            type="file"
            accept={allowedFileTypes.join(",")}
            multiple={multiple}
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mode === "update" &&
          defaultImages.map(
            (url, index) =>
              !removedDefaultImages.includes(index) && (
                <div
                  key={`default-${index}`}
                  className="relative group aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={url}
                    alt={`Existing Image ${index + 1}`}
                    className={`h-full w-full object-cover ${imageClassName}`}
                    style={imageStyle}
                  />
                  <div
                    onClick={() => removeDefaultImage(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {deleteIcon}
                  </div>
                </div>
              )
          )}

        {images.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className={`h-full w-full object-cover ${imageClassName}`}
              style={imageStyle}
            />
            <div
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {deleteIcon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}