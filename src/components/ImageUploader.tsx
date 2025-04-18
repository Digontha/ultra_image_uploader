"use client";
import { TrashIcon, UploadCloudIcon } from "lucide-react";
import { useState } from "react";

export interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
  mode: "add" | "update";
  defaultImages?: string[];
  multiple?: boolean;
  inputStyles?: string;
  containerStyles?: string;
  uploadText?: string;
  typeText?: string;
}

export function ImageUploader({
  images,
  setImages,
  mode,
  defaultImages = [],
  multiple = false,
  inputStyles = "",
  containerStyles = "",
  uploadText = "Browse files or drag & drop",
  typeText = "PNG, JPG, JPEG, WEBP",
}: ImageUploaderProps) {
  const [removedDefaultImages, setRemovedDefaultImages] = useState<number[]>(
    []
  );
  console.log(removedDefaultImages);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (!multiple && files.length > 1) {
        alert("Only one image can be uploaded at a time.");
        return;
      }
      setImages(multiple ? [...images, ...files] : [files[0]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Function to remove a default image
  const removeDefaultImage = (index: number) => {
    setRemovedDefaultImages((prev) => [...prev, index]);
  };

  return (
    <div className={`space-y-4 ${containerStyles}`}>
      <div className="flex flex-wrap gap-4">
        {/* Upload Box */}
        <div
          className={`${inputStyles} h-40 w-full bg-gray-100 border border-gray-200 cursor-pointer flex justify-center items-center text-white text-center relative rounded-xs duration-300`}
        >
          <div className="flex flex-col items-center text-black">
            <UploadCloudIcon className="text-3xl text-gray-900 mb-1" />
            <span className="text-sm text-gray-800 font-semibold">
              {uploadText}
            </span>
            <span className="text-gray-600 text-xs">{typeText}</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer rounded-lg"
          />
        </div>

        {/* Default Images (Update Mode) */}
        {mode === "update" &&
          defaultImages.map(
            (url, index) =>
              !removedDefaultImages.includes(index) && (
                <div key={`default-${index}`} className="relative w-fit">
                  <img
                    src={url}
                    alt={`Existing Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-32 w-32 object-cover rounded-sm border border-gray-200 cursor-pointer  hover:shadow-lg transition-shadow duration-200"
                  />
                  <TrashIcon
                    onClick={() => removeDefaultImage(index)}
                    className="absolute -top-2 -right-2 rounded-full bg-red-600 text-2xl text-white cursor-pointer p-1 hover:bg-red-700 transition-colors duration-200"
                  />
                </div>
              )
          )}

        {/* Uploaded Images */}
        {images.map((image, index) => (
          <div key={index} className="relative w-fit">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              width={100}
              height={100}
              className="h-32 w-32 object-cover rounded-sm border border-gray-200 cursor-pointer  hover:shadow-lg  duration-200"
            />
            <TrashIcon
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 rounded-full bg-red-600 text-2xl text-white cursor-pointer p-1 hover:bg-red-700 transition-colors duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
