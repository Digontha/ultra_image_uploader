"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrashIcon, UploadCloudIcon } from "lucide-react";
import { useState, useCallback } from "react";
export function ImageUploader({ images, setImages, mode, defaultImages = [], multiple = false, maxFileSize = 5 * 1024 * 1024, // 5MB
allowedFileTypes = ["image/jpeg", "image/png"], containerClassName = "", uploadBoxClassName = "", imageClassName = "", uploadBoxStyle = {}, imageStyle = {}, uploadIcon = _jsx(UploadCloudIcon, { className: "w-12 h-12 text-blue-500 mb-2" }), deleteIcon = (_jsx("div", { className: "absolute -top-2 -right-2 p-1 bg-red-500 rounded-full shadow-lg transform transition-transform hover:scale-110", children: _jsx(TrashIcon, { className: "w-4 h-4 text-white" }) })), uploadText = "Choose files to upload", dragAndDropText = "or drag and drop files here", fileTypeText = "PNG, JPG, or JPEG files up to 5MB", onUpload, onRemove, onFileValidationError, }) {
    const [removedDefaultImages, setRemovedDefaultImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
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
        setIsDragging(true);
    }, []);
    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);
    const removeImage = (index) => {
        const removedFile = images[index];
        onRemove?.(removedFile, index);
        setImages(images.filter((_, i) => i !== index));
    };
    const removeDefaultImage = (index) => {
        setRemovedDefaultImages((prev) => [...prev, index]);
    };
    return (_jsxs("div", { className: `space-y-4 ${containerClassName}`, children: [_jsx("div", { className: `
          relative rounded-lg transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${uploadBoxClassName || 'border-2 border-dashed p-8'}
        `, style: uploadBoxStyle, onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, children: _jsxs("div", { className: "flex flex-col items-center justify-center text-center", children: [uploadIcon, _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: uploadText }), _jsx("p", { className: "text-sm text-gray-500", children: dragAndDropText }), _jsx("p", { className: "text-xs text-gray-400", children: fileTypeText })] }), _jsx("input", { type: "file", accept: allowedFileTypes.join(","), multiple: multiple, onChange: handleImageChange, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer" })] }) }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: [mode === "update" &&
                        defaultImages.map((url, index) => !removedDefaultImages.includes(index) && (_jsxs("div", { className: "relative group aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow", children: [_jsx("img", { src: url, alt: `Existing Image ${index + 1}`, className: `h-full w-full object-cover ${imageClassName}`, style: imageStyle }), _jsx("div", { onClick: () => removeDefaultImage(index), className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer", children: deleteIcon })] }, `default-${index}`))), images.map((image, index) => (_jsxs("div", { className: "relative group aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow", children: [_jsx("img", { src: URL.createObjectURL(image), alt: `Preview ${index + 1}`, className: `h-full w-full object-cover ${imageClassName}`, style: imageStyle }), _jsx("div", { onClick: () => removeImage(index), className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer", children: deleteIcon })] }, index)))] })] }));
}
