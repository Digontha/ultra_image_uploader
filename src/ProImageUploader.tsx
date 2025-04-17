"use client";
import { TrashIcon, UploadCloudIcon } from "lucide-react";
import { useState, useCallback } from "react";

export interface ImageUploaderProps {
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
  uploadIcon = <UploadCloudIcon className="text-3xl text-gray-900 mb-1" />,
  deleteIcon = (
    <TrashIcon className="absolute -top-[10px] -right-[10px] rounded-full bg-red-500 text-2xl text-white cursor-pointer p-1" />
  ),
  uploadText = "Choose files to upload",
  dragAndDropText = "Drag and drop files here",
  fileTypeText = "PNG, JPG, or JPEG files",
  onUpload,
  onRemove,
  onFileValidationError,
}: ImageUploaderProps) { 
  const [removedDefaultImages, setRemovedDefaultImages] = useState<number[]>(
    []
  );

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
    <div className={containerClassName}>
      <div
        className="flex flex-wrap gap-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div
          className={`h-40 w-full bg-gray-100 border-2 border-gray-300 cursor-pointer flex justify-center items-center text-white text-center relative ${uploadBoxClassName}`}
          style={uploadBoxStyle}
        >
          <div className="flex flex-col items-center text-black">
            {uploadIcon}
            <span className="text-sm text-gray-800">{uploadText}</span>
            <span className="text-sm text-gray-800">{dragAndDropText}</span>
            <span className="text-gray-600 text-xs">{fileTypeText}</span>
          </div>
          <input
            type="file"
            accept={allowedFileTypes.join(",")}
            multiple={multiple}
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer rounded-lg"
          />
        </div>

        {mode === "update" &&
          defaultImages.map(
            (url, index) =>
              !removedDefaultImages.includes(index) && (
                <div key={`default-${index}`} className="relative w-fit">
                  <img
                    src={url}
                    alt={`Existing Image ${index + 1}`}
                    className={`h-24 w-24 object-cover ${imageClassName}`}
                    style={imageStyle}
                  />
                  <div onClick={() => removeDefaultImage(index)}>
                    {deleteIcon}
                  </div>
                </div>
              )
          )}

        {images.map((image, index) => (
          <div key={index} className="relative w-fit">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className={`h-24 w-24 object-cover ${imageClassName}`}
              style={imageStyle}
            />
            <div onClick={() => removeImage(index)}>{deleteIcon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
