"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrashIcon, UploadCloudIcon } from "lucide-react";
import { useState } from "react";
export function ImageUploader({ images, setImages, mode, defaultImages = [], multiple = false, inputStyles = "", containerStyles = "", uploadText = "Browse files or drag & drop", typeText = "PNG, JPG, JPEG, WEBP", }) {
    const [removedDefaultImages, setRemovedDefaultImages] = useState([]);
    console.log(removedDefaultImages);
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            if (!multiple && files.length > 1) {
                alert("Only one image can be uploaded at a time.");
                return;
            }
            setImages(multiple ? [...images, ...files] : [files[0]]);
        }
    };
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    // Function to remove a default image
    const removeDefaultImage = (index) => {
        setRemovedDefaultImages((prev) => [...prev, index]);
    };
    return (_jsx("div", { className: `space-y-4 ${containerStyles}`, children: _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: `${inputStyles} h-40 w-full bg-gray-100 border border-gray-200 cursor-pointer flex justify-center items-center text-white text-center relative rounded-xs duration-300`, children: [_jsxs("div", { className: "flex flex-col items-center text-black", children: [_jsx(UploadCloudIcon, { className: "text-3xl text-gray-900 mb-1" }), _jsx("span", { className: "text-sm text-gray-800 font-semibold", children: uploadText }), _jsx("span", { className: "text-gray-600 text-xs", children: typeText })] }), _jsx("input", { type: "file", accept: "image/*", multiple: multiple, onChange: handleImageChange, className: "absolute inset-0 opacity-0 cursor-pointer rounded-lg" })] }), mode === "update" &&
                    defaultImages.map((url, index) => !removedDefaultImages.includes(index) && (_jsxs("div", { className: "relative w-fit", children: [_jsx("img", { src: url, alt: `Existing Image ${index + 1}`, width: 100, height: 100, className: "h-32 w-32 object-cover rounded-sm border border-gray-200 cursor-pointer  hover:shadow-lg transition-shadow duration-200" }), _jsx(TrashIcon, { onClick: () => removeDefaultImage(index), className: "absolute -top-2 -right-2 rounded-full bg-red-600 text-2xl text-white cursor-pointer p-1 hover:bg-red-700 transition-colors duration-200" })] }, `default-${index}`))), images.map((image, index) => (_jsxs("div", { className: "relative w-fit", children: [_jsx("img", { src: URL.createObjectURL(image), alt: `Preview ${index + 1}`, width: 100, height: 100, className: "h-32 w-32 object-cover rounded-sm border border-gray-200 cursor-pointer  hover:shadow-lg  duration-200" }), _jsx(TrashIcon, { onClick: () => removeImage(index), className: "absolute -top-2 -right-2 rounded-full bg-red-600 text-2xl text-white cursor-pointer p-1 hover:bg-red-700 transition-colors duration-200" })] }, index)))] }) }));
}
