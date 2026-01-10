'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { uploadImage } from '../providers';
import { isImageFile, formatFileSize } from '../utils/validation';
// Theme presets
export const themes = {
    light: {
        primary: '#6366f1',
        background: '#ffffff',
        border: '#e5e7eb',
        text: '#1f2937',
        textSecondary: '#6b7280',
        error: '#ef4444',
        success: '#10b981',
        radius: '12px',
    },
    dark: {
        primary: '#8b5cf6',
        background: '#1f2937',
        border: '#374151',
        text: '#f9fafb',
        textSecondary: '#9ca3af',
        error: '#f87171',
        success: '#34d399',
        radius: '12px',
    },
    modern: {
        primary: '#ec4899',
        background: '#fdf2f8',
        border: '#f9a8d4',
        text: '#831843',
        textSecondary: '#9d174d',
        error: '#dc2626',
        success: '#059669',
        radius: '16px',
    },
    ocean: {
        primary: '#0891b2',
        background: '#ecfeff',
        border: '#a5f3fc',
        text: '#164e63',
        textSecondary: '#155e75',
        error: '#dc2626',
        success: '#059669',
        radius: '14px',
    },
    sunset: {
        primary: '#f97316',
        background: '#fff7ed',
        border: '#fdba74',
        text: '#7c2d12',
        textSecondary: '#9a3412',
        error: '#dc2626',
        success: '#059669',
        radius: '12px',
    },
};
export function ImageUploader({ images, setImages, mode = 'add', defaultImages = [], multiple = false, theme = 'light', uploadText = 'Drop images here or click to browse', maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'], showFileSize = true, dragAndDrop = true, previewWidth = 140, previewHeight = 140, className = '', autoUpload = false, uploadConfig, onUploadComplete, onUploadError, }) {
    const [removedDefaults, setRemovedDefaults] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState({});
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState([]);
    const fileInputRef = useRef(null);
    const dragCounter = useRef(0);
    const currentTheme = typeof theme === 'string' ? themes[theme] : theme;
    const mergedTheme = { ...themes.light, ...currentTheme };
    // Auto-upload effect
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
                onProgress: (p) => {
                    setProgress((prev) => ({ ...prev, [file.name]: p.percentage }));
                },
            })));
            const urls = results.map((r) => r.url);
            onUploadComplete?.(urls);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Upload failed');
            onUploadError?.(error);
        }
        finally {
            setUploading(false);
            setProgress({});
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
            setErrors((prev) => [...prev, ...invalid]);
        }
        if (valid.length === 0)
            return;
        if (!multiple && valid.length > 1) {
            alert('Only one image allowed');
            return;
        }
        setImages(multiple ? [...images, ...valid] : [valid[0]]);
    }, [images, multiple, setImages, validateFiles]);
    const handleChange = (e) => {
        if (e.target.files?.length) {
            handleFiles(e.target.files);
            e.target.value = '';
        }
    };
    const handleDragEnter = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items?.length)
            setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0)
            setIsDragging(false);
    };
    const handleDragOver = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
    };
    const handleDrop = (e) => {
        if (!dragAndDrop)
            return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;
        if (e.dataTransfer.files?.length) {
            handleFiles(e.dataTransfer.files);
        }
    };
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    const removeDefault = (index) => {
        setRemovedDefaults((prev) => [...prev, index]);
    };
    const dismissError = (index) => {
        setErrors((prev) => prev.filter((_, i) => i !== index));
    };
    return (_jsxs("div", { className: `image-uploader ${className}`, children: [errors.length > 0 && (_jsx("div", { className: "space-y-2 mb-4", children: errors.map((file, i) => (_jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg", style: {
                        backgroundColor: `${mergedTheme.error}15`,
                        border: `1px solid ${mergedTheme.error}40`,
                    }, children: [_jsx(AlertCircle, { size: 18, style: { color: mergedTheme.error, flexShrink: 0 } }), _jsxs("span", { className: "text-sm flex-1", style: { color: mergedTheme.text }, children: [_jsx("strong", { children: file.name }), ": ", file.error] }), _jsx("button", { onClick: () => dismissError(i), className: "p-1 hover:opacity-70", style: { color: mergedTheme.textSecondary }, children: _jsx(X, { size: 16 }) })] }, i))) })), _jsxs("div", { className: "relative h-44 w-full flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300", style: {
                    backgroundColor: isDragging ? `${mergedTheme.primary}10` : mergedTheme.background,
                    border: `2px dashed ${isDragging ? mergedTheme.primary : mergedTheme.border}`,
                    borderRadius: mergedTheme.radius,
                    transform: isDragging ? 'scale(1.01)' : 'scale(1)',
                }, onClick: () => fileInputRef.current?.click(), onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop, children: [_jsx("div", { className: "p-3 rounded-full mb-3", style: { backgroundColor: `${mergedTheme.primary}15` }, children: uploading ? (_jsx(Loader2, { size: 32, className: "animate-spin", style: { color: mergedTheme.primary } })) : (_jsx(Upload, { size: 32, style: { color: mergedTheme.primary } })) }), _jsx("p", { className: "font-semibold mb-1", style: { color: mergedTheme.text }, children: uploadText }), _jsxs("p", { className: "text-sm", style: { color: mergedTheme.textSecondary }, children: ["PNG, JPG, WEBP up to ", formatFileSize(maxSize)] }), uploading && (_jsx("p", { className: "text-sm mt-2", style: { color: mergedTheme.primary }, children: "Uploading..." })), _jsx("input", { ref: fileInputRef, type: "file", accept: allowedTypes.join(','), multiple: multiple, onChange: handleChange, className: "absolute inset-0 opacity-0 cursor-pointer" })] }), _jsxs("div", { className: "flex flex-wrap gap-3 mt-4", children: [mode === 'update' &&
                        defaultImages.map((url, i) => !removedDefaults.includes(i) && (_jsxs("div", { className: "relative group", style: { width: `${previewWidth}px` }, children: [_jsx("img", { src: url, alt: `Existing ${i + 1}`, className: "w-full object-cover shadow-md hover:shadow-xl transition-all duration-300", style: {
                                        height: `${previewHeight}px`,
                                        borderRadius: mergedTheme.radius,
                                    } }), _jsx("button", { onClick: () => removeDefault(i), className: "absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity", style: { backgroundColor: mergedTheme.error }, children: _jsx(X, { size: 14, className: "text-white" }) })] }, `default-${i}`))), images.map((file, i) => {
                        const fileProgress = progress[file.name];
                        return (_jsxs("div", { className: "relative group", style: { width: `${previewWidth}px` }, children: [_jsx("img", { src: URL.createObjectURL(file), alt: `Preview ${i + 1}`, className: "w-full object-cover shadow-md hover:shadow-xl transition-all duration-300", style: {
                                        height: `${previewHeight}px`,
                                        borderRadius: mergedTheme.radius,
                                    } }), fileProgress !== undefined && fileProgress < 100 && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center rounded-lg", style: {
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        borderRadius: mergedTheme.radius,
                                    }, children: _jsxs("span", { className: "text-white font-semibold text-sm", children: [fileProgress, "%"] }) })), showFileSize && (_jsx("div", { className: "absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium", style: {
                                        backgroundColor: `${mergedTheme.background}EE`,
                                        color: mergedTheme.text,
                                    }, children: formatFileSize(file.size) })), _jsx("button", { onClick: () => removeImage(i), className: "absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity", style: { backgroundColor: mergedTheme.error }, children: _jsx(X, { size: 14, className: "text-white" }) })] }, i));
                    })] }), images.length === 0 &&
                defaultImages.filter((_, i) => !removedDefaults.includes(i)).length === 0 && (_jsxs("div", { className: "flex items-center justify-center gap-2 py-6", style: { color: mergedTheme.textSecondary }, children: [_jsx(ImageIcon, { size: 18 }), _jsx("span", { className: "text-sm", children: "No images selected" })] }))] }));
}
//# sourceMappingURL=ImageUploader.js.map