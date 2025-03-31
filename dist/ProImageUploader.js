"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrashIcon, UploadCloudIcon } from "lucide-react";
import { useState, useCallback } from "react";
export function ImageUploader({ images, setImages, mode, defaultImages = [], multiple = false, maxFileSize = 5 * 1024 * 1024, // 5MB
allowedFileTypes = ["image/jpeg", "image/png"], containerClassName = "", uploadBoxClassName = "", imageClassName = "", uploadBoxStyle = {}, imageStyle = {}, uploadIcon = _jsx(UploadCloudIcon, { className: "text-3xl text-gray-900 mb-1" }), deleteIcon = (_jsx(TrashIcon, { className: "absolute -top-[10px] -right-[10px] rounded-full bg-red-500 text-2xl text-white cursor-pointer p-1" })), uploadText = "Choose files to upload", dragAndDropText = "Drag and drop files here", fileTypeText = "PNG, JPG, or JPEG files", onUpload, onRemove, onFileValidationError, }) {
    const [removedDefaultImages, setRemovedDefaultImages] = useState([]);
    const handleImageChange = (e) => {
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
    const handleDrop = useCallback((e) => {
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
    }, [
        images,
        multiple,
        setImages,
        allowedFileTypes,
        maxFileSize,
        onFileValidationError,
        onUpload,
    ]);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);
    const removeImage = (index) => {
        const removedFile = images[index];
        onRemove?.(removedFile, index);
        setImages(images.filter((_, i) => i !== index));
    };
    const removeDefaultImage = (index) => {
        setRemovedDefaultImages((prev) => [...prev, index]);
    };
    return (_jsx("div", { className: containerClassName, children: _jsxs("div", { className: "flex flex-wrap gap-4", onDrop: handleDrop, onDragOver: handleDragOver, children: [_jsxs("div", { className: `h-40 w-full bg-gray-100 border-2 border-gray-300 cursor-pointer flex justify-center items-center text-white text-center relative ${uploadBoxClassName}`, style: uploadBoxStyle, children: [_jsxs("div", { className: "flex flex-col items-center text-black", children: [uploadIcon, _jsx("span", { className: "text-sm text-gray-800", children: uploadText }), _jsx("span", { className: "text-sm text-gray-800", children: dragAndDropText }), _jsx("span", { className: "text-gray-600 text-xs", children: fileTypeText })] }), _jsx("input", { type: "file", accept: allowedFileTypes.join(","), multiple: multiple, onChange: handleImageChange, className: "absolute inset-0 opacity-0 cursor-pointer rounded-lg" })] }), mode === "update" &&
                    defaultImages.map((url, index) => !removedDefaultImages.includes(index) && (_jsxs("div", { className: "relative w-fit", children: [_jsx("img", { src: url, alt: `Existing Image ${index + 1}`, className: `h-24 w-24 object-cover ${imageClassName}`, style: imageStyle }), _jsx("div", { onClick: () => removeDefaultImage(index), children: deleteIcon })] }, `default-${index}`))), images.map((image, index) => (_jsxs("div", { className: "relative w-fit", children: [_jsx("img", { src: URL.createObjectURL(image), alt: `Preview ${index + 1}`, className: `h-24 w-24 object-cover ${imageClassName}`, style: imageStyle }), _jsx("div", { onClick: () => removeImage(index), children: deleteIcon })] }, index)))] }) }));
}
