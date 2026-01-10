"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { uploadImage } from '../utils/upload';
import { isImageFile, formatFileSize } from '../utils/validation';
const THEME_PRESETS = {
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
export function ImageUploader({ images, setImages, mode = 'add', defaultImages = [], multiple = false, className = '', uploadText = 'Drop images here or click to browse', typeText = 'PNG, JPG, JPEG, WEBP, GIF up to 10MB', maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'], theme = 'light', customTheme, showFileSize = true, dragAndDrop = true, previewWidth = 150, previewHeight = 150, onUploadComplete, onUploadError, autoUpload = false, uploadConfig, }) {
    const [removedDefaultImages, setRemovedDefaultImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploading, setUploading] = useState(false);
    const [filesWithErrors, setFilesWithErrors] = useState([]);
    const fileInputRef = useRef(null);
    const dragCounterRef = useRef(0);
    const currentTheme = { ...THEME_PRESETS[theme], ...customTheme };
    useEffect(() => {
        if (autoUpload && uploadConfig && images.length > 0 && !uploading) {
            handleAutoUpload();
        }
    }, [images]);
    const handleAutoUpload = async () => {
        if (!uploadConfig)
            return;
        setUploading(true);
        try {
            const results = await Promise.all(images.map((file) => uploadImage(file, uploadConfig.provider, uploadConfig.config, {
                onProgress: (progress) => {
                    setUploadProgress((prev) => ({
                        ...prev,
                        [file.name]: progress.percentage,
                    }));
                },
            })));
            const urls = results.map((r) => r.url);
            onUploadComplete?.(urls);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Upload failed');
            onUploadError?.(err);
            setFilesWithErrors((prev) => [...prev, { ...images[0], error: err.message }]);
        }
        finally {
            setUploading(false);
            setUploadProgress({});
        }
    };
    const validateFiles = useCallback((files) => {
        const valid = [];
        const invalid = [];
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
    }, [maxSize, allowedTypes]);
    const handleFiles = useCallback((files) => {
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
    }, [images, multiple, setImages, validateFiles]);
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
        // Reset input so same file can be selected again if needed
        e.target.value = '';
    };
    const handleDragEnter = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };
    const handleDragLeave = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
            setIsDragging(false);
        }
    };
    const handleDragOver = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounterRef.current = 0;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    const removeDefaultImage = (index) => {
        setRemovedDefaultImages((prev) => [...prev, index]);
    };
    const dismissError = (index) => {
        setFilesWithErrors((prev) => prev.filter((_, i) => i !== index));
    };
    const uploadAreaStyle = {
        backgroundColor: isDragging
            ? `${currentTheme.primary}20`
            : currentTheme.background,
        border: `2px dashed ${isDragging ? currentTheme.primary : currentTheme.border}`,
        borderRadius: currentTheme.radius,
        transition: 'all 0.3s ease',
    };
    return (_jsxs("div", { className: `space-y-4 ${className}`, children: [filesWithErrors.length > 0 && (_jsx("div", { className: "space-y-2", children: filesWithErrors.map((file, idx) => (_jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg", style: {
                        backgroundColor: `${currentTheme.error}10`,
                        border: `1px solid ${currentTheme.error}30`,
                    }, children: [_jsx(AlertCircle, { size: 20, style: { color: currentTheme.error } }), _jsxs("span", { className: "flex-1 text-sm", style: { color: currentTheme.text }, children: [_jsx("strong", { children: file.name }), ": ", file.error] }), _jsx("button", { onClick: () => dismissError(idx), className: "p-1 hover:opacity-70", style: { color: currentTheme.textSecondary }, children: _jsx(X, { size: 16 }) })] }, idx))) })), _jsxs("div", { className: `relative h-48 w-full flex justify-center items-center text-center cursor-pointer ${isDragging ? 'scale-[1.02]' : ''}`, style: uploadAreaStyle, onClick: () => fileInputRef.current?.click(), onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop, children: [_jsxs("div", { className: "flex flex-col items-center gap-2 pointer-events-none", children: [_jsx("div", { className: "p-4 rounded-full", style: { backgroundColor: `${currentTheme.primary}10` }, children: uploading ? (_jsx(Loader2, { size: 32, className: "animate-spin", style: { color: currentTheme.primary } })) : (_jsx(Upload, { size: 32, style: { color: currentTheme.primary } })) }), _jsx("span", { className: "text-base font-semibold", style: { color: currentTheme.text }, children: uploadText }), _jsx("span", { className: "text-sm", style: { color: currentTheme.textSecondary }, children: typeText }), uploading && (_jsx("span", { className: "text-sm", style: { color: currentTheme.primary }, children: "Uploading..." }))] }), _jsx("input", { ref: fileInputRef, type: "file", accept: allowedTypes.join(','), multiple: multiple, onChange: handleImageChange, className: "absolute inset-0 opacity-0 cursor-pointer" })] }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [mode === 'update' &&
                        defaultImages.map((url, index) => !removedDefaultImages.includes(index) && (_jsxs("div", { className: "relative group", style: { width: `${previewWidth}px` }, children: [_jsx("img", { src: url, alt: `Existing ${index + 1}`, width: previewWidth, height: previewHeight, className: "object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300", style: {
                                        borderRadius: currentTheme.radius,
                                        height: `${previewHeight}px`,
                                    } }), _jsx("button", { onClick: () => removeDefaultImage(index), className: "absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200", style: { backgroundColor: currentTheme.error }, children: _jsx(X, { size: 16, className: "text-white" }) })] }, `default-${index}`))), images.map((image, index) => {
                        const progress = uploadProgress[image.name];
                        return (_jsxs("div", { className: "relative group", style: { width: `${previewWidth}px` }, children: [_jsx("img", { src: URL.createObjectURL(image), alt: `Preview ${index + 1}`, width: previewWidth, height: previewHeight, className: "object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300", style: {
                                        borderRadius: currentTheme.radius,
                                        height: `${previewHeight}px`,
                                    } }), progress !== undefined && progress < 100 && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg", children: _jsxs("span", { className: "text-white font-semibold", children: [progress, "%"] }) })), showFileSize && (_jsx("div", { className: "absolute bottom-2 left-2 px-2 py-1 rounded text-xs", style: {
                                        backgroundColor: `${currentTheme.background}90`,
                                        color: currentTheme.text,
                                    }, children: formatFileSize(image.size) })), _jsx("button", { onClick: () => removeImage(index), className: "absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200", style: { backgroundColor: currentTheme.error }, children: _jsx(X, { size: 16, className: "text-white" }) })] }, index));
                    })] }), images.length === 0 && defaultImages.filter((_, i) => !removedDefaultImages.includes(i)).length === 0 && (_jsxs("div", { className: "flex items-center justify-center gap-2 py-8", style: { color: currentTheme.textSecondary }, children: [_jsx(ImageIcon, { size: 20 }), _jsx("span", { className: "text-sm", children: "No images selected" })] }))] }));
}
//# sourceMappingURL=ImageUploader.js.map