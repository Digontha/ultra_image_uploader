'use client';
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { uploadImage } from '../providers';
import { isImageFile, formatFileSize } from '../utils/validation';
// Theme definitions - shadcn/ui inspired
export const themes = {
    nature: {
        name: 'Nature',
        colors: {
            primary: '#16a34a',
            primaryHover: '#15803d',
            background: '#f0fdf4',
            border: '#bbf7d0',
            text: '#14532d',
            textSecondary: '#166534',
            cardBg: '#ffffff',
            cardBorder: '#dcfce7',
            shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
    },
    modern: {
        name: 'Modern',
        colors: {
            primary: '#09090b',
            primaryHover: '#18181b',
            background: '#fafafa',
            border: '#e4e4e7',
            text: '#18181b',
            textSecondary: '#71717a',
            cardBg: '#ffffff',
            cardBorder: '#e4e4e7',
            shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
    },
    fresh: {
        name: 'Fresh',
        colors: {
            primary: '#0284c7',
            primaryHover: '#0369a1',
            background: '#f0f9ff',
            border: '#bae6fd',
            text: '#0c4a6e',
            textSecondary: '#075985',
            cardBg: '#ffffff',
            cardBorder: '#e0f2fe',
            shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
    },
    dark: {
        name: 'Dark',
        colors: {
            primary: '#3b82f6',
            primaryHover: '#2563eb',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '#334155',
            text: '#f8fafc',
            textSecondary: '#94a3b8',
            cardBg: '#1e293b',
            cardBorder: '#334155',
            shadow: '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        },
    },
    ocean: {
        name: 'Ocean',
        colors: {
            primary: '#06b6d4',
            primaryHover: '#0891b2',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            border: '#7dd3fc',
            text: '#f0f9ff',
            textSecondary: '#bae6fd',
            cardBg: '#0c4a6e',
            cardBorder: '#0369a1',
            shadow: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
        },
    },
};
const borderRadiusMap = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
};
export function ImageUploader({ images, setImages, mode = 'add', defaultImages = [], multiple = true, maxSize = 50 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'], maxImages = 20, uploadConfig, autoUpload = false, onUploadComplete, onUploadError, theme = 'nature', customTheme, showThemeSelector = false, previewSize = 'lg', borderRadius = 'md', className = '', containerClassName = 'max-w-5xl mx-auto mt-10', showImageCount = true, showFileSize = true, showFileName = true, customUploadButton, hideDefaultUploadArea = false, onUploadClick, }) {
    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [isDragging, setIsDragging] = useState(false);
    const [fileStates, setFileStates] = useState(new Map());
    const [uploading, setUploading] = useState(false);
    const [removedDefaults, setRemovedDefaults] = useState([]);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const dragCounter = useRef(0);
    const currentTheme = customTheme || themes[selectedTheme];
    const t = currentTheme.colors;
    const radius = borderRadiusMap[borderRadius];
    // Generate previews
    useEffect(() => {
        const newStates = new Map();
        images.forEach((file) => {
            const key = `${file.name}-${file.size}`;
            const existing = fileStates.get(key);
            if (existing?.preview) {
                newStates.set(key, existing);
            }
            else {
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
    // Validate upload config
    const validateUploadConfig = useCallback(() => {
        if (!uploadConfig)
            return null;
        if (uploadConfig.provider === 'imgbb') {
            if (!uploadConfig.config.apiKey) {
                return 'ImgBB API key is missing. Please provide a valid API key in the uploadConfig.';
            }
            if (uploadConfig.config.apiKey.trim() === '') {
                return 'ImgBB API key cannot be empty.';
            }
        }
        if (uploadConfig.provider === 'cloudinary') {
            if (!uploadConfig.config.cloudName) {
                return 'Cloudinary cloud name is missing. Please provide a valid cloud name in the uploadConfig.';
            }
            if (uploadConfig.config.cloudName.trim() === '') {
                return 'Cloudinary cloud name cannot be empty.';
            }
        }
        return null;
    }, [uploadConfig]);
    const handleAutoUpload = async () => {
        if (!uploadConfig)
            return;
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
            const results = await Promise.all(images.map(async (file) => {
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
            }));
            const urls = results.map((r) => r.url);
            onUploadComplete?.(urls);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            onUploadError?.(err instanceof Error ? err : new Error(errorMessage));
        }
        finally {
            setUploading(false);
        }
    };
    const validateFiles = useCallback((files) => {
        const valid = [];
        const invalid = [];
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
    }, [maxSize, allowedTypes, maxImages, images.length]);
    const handleFiles = useCallback((files) => {
        const { valid } = validateFiles(files);
        if (valid.length === 0)
            return;
        if (!multiple && valid.length > 1) {
            alert('Only one file allowed');
            return;
        }
        setImages(multiple ? [...images, ...valid] : [valid[0]]);
    }, [images, multiple, setImages, validateFiles, maxImages]);
    const handleChange = (e) => {
        if (e.target.files?.length) {
            handleFiles(e.target.files);
            e.target.value = '';
        }
    };
    const handleUploadClick = () => {
        onUploadClick?.();
        fileInputRef.current?.click();
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items?.length)
            setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0)
            setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;
        if (e.dataTransfer.files?.length) {
            handleFiles(e.dataTransfer.files);
        }
    };
    const removeFile = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    const removeDefaultImage = (index) => {
        setRemovedDefaults((prev) => [...prev, index]);
    };
    const getFileState = (file) => {
        const key = `${file.name}-${file.size}`;
        return fileStates.get(key) || { ...file, progress: 0, status: 'pending' };
    };
    return (_jsxs("div", { className: `image-uploader ${containerClassName} ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-semibold tracking-tight", style: { color: t.text }, children: [mode === 'update' ? 'Update' : 'Upload', " Images"] }), _jsx("p", { className: "text-sm", style: { color: t.textSecondary }, children: multiple ? 'Drag and drop or click to upload' : 'Select an image to upload' })] }), showImageCount && (_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border", style: {
                            backgroundColor: t.cardBg,
                            borderColor: t.cardBorder,
                            color: t.text,
                        }, children: [_jsx("span", { children: images.length }), maxImages && _jsxs("span", { className: "text-muted", style: { color: t.textSecondary }, children: ["/ ", maxImages] })] }))] }), error && (_jsxs("div", { className: "mb-4 p-4 rounded-md border flex items-start gap-3", style: { backgroundColor: '#fef2f2', borderColor: '#fecaca' }, children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5", style: { color: '#dc2626' }, fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", style: { color: '#991b1b' }, children: "Upload Error" }), _jsx("p", { className: "text-sm mt-1", style: { color: '#b91c1c' }, children: error })] }), _jsxs("button", { onClick: () => setError(null), className: "flex-shrink-0 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2", style: { color: '#991b1b' }, "aria-label": "Dismiss error", children: [_jsx("span", { className: "sr-only", children: "Dismiss" }), _jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })] })] })), showThemeSelector && (_jsx("div", { className: "mb-6 inline-flex gap-1 p-1 rounded-lg border", style: { backgroundColor: t.background, borderColor: t.cardBorder }, children: Object.keys(themes).map((key) => (_jsx("button", { onClick: () => setSelectedTheme(key), className: "px-3 py-1.5 text-sm font-medium rounded-md transition-colors", style: {
                        backgroundColor: selectedTheme === key ? t.cardBg : 'transparent',
                        color: selectedTheme === key ? t.text : t.textSecondary,
                    }, children: themes[key].name }, key))) })), customUploadButton && (_jsx("div", { className: "mb-4", children: _jsx("div", { onClick: handleUploadClick, children: customUploadButton }) })), _jsx("input", { ref: fileInputRef, type: "file", accept: allowedTypes.join(','), multiple: multiple, onChange: handleChange, className: "hidden", style: { display: 'none' } }), !hideDefaultUploadArea && (_jsx("div", { role: "button", tabIndex: 0, "aria-label": "Upload images", className: "relative group cursor-pointer overflow-hidden transition-all duration-200", style: {
                    borderRadius: radius,
                    border: `2px dashed ${isDragging ? t.primary : t.cardBorder}`,
                    backgroundColor: t.background,
                }, onClick: handleUploadClick, onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleUploadClick();
                    }
                }, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop, children: _jsxs("div", { className: "flex flex-col items-center justify-center p-8", children: [_jsx("div", { className: "mb-4 flex items-center justify-center transition-transform duration-200", style: { color: isDragging ? t.primary : t.textSecondary }, children: _jsx("div", { className: "flex items-center justify-center rounded-full", style: {
                                    width: previewSize === '2xl' ? '96px' : previewSize === 'xl' ? '80px' : previewSize === 'lg' ? '64px' : previewSize === 'md' ? '56px' : previewSize === 'sm' ? '48px' : '40px',
                                    height: previewSize === '2xl' ? '96px' : previewSize === 'xl' ? '80px' : previewSize === 'lg' ? '64px' : previewSize === 'md' ? '56px' : previewSize === 'sm' ? '48px' : '40px',
                                    backgroundColor: t.cardBg,
                                    border: `1px solid ${t.cardBorder}`,
                                }, children: _jsx(ImageIcon, { size: 24 }) }) }), _jsx("div", { className: "text-center space-y-1", children: _jsx("p", { className: "text-sm font-medium", style: { color: t.text }, children: isDragging ? 'Drop here' : 'Click or drop to upload' }) })] }) })), (images.length > 0 || defaultImages.length > 0) && (_jsx("div", { className: "mt-6", children: _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: [mode === 'update' &&
                            defaultImages.map((url, index) => !removedDefaults.includes(index) && (_jsx("div", { className: "relative group aspect-square", style: { animation: 'fadeIn 0.2s ease-out' }, children: _jsxs("div", { className: "relative w-full h-full overflow-hidden border transition-all duration-200 hover:shadow-md", style: {
                                        borderRadius: radius,
                                        borderColor: t.cardBorder,
                                        backgroundColor: t.cardBg,
                                    }, children: [_jsx("img", { src: url, alt: `Preview ${index + 1}`, className: "w-full h-full object-cover" }), _jsx("button", { onClick: () => removeDefaultImage(index), className: "absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-80", style: {
                                                backgroundColor: 'rgba(0,0,0,0.7)',
                                                backdropFilter: 'blur(4px)',
                                            }, "aria-label": "Remove image", children: _jsx(Trash2, { size: 14, className: "text-white" }) })] }) }, `default-${index}`))), images.map((file, index) => {
                            const state = getFileState(file);
                            const isUploading = state.status === 'uploading';
                            const isDone = state.status === 'done';
                            return (_jsxs("div", { className: "relative group aspect-square", style: { animation: 'fadeIn 0.2s ease-out', animationDelay: `${index * 30}ms` }, children: [_jsxs("div", { className: "relative w-full h-full overflow-hidden border transition-all duration-200 hover:shadow-md", style: {
                                            borderRadius: radius,
                                            borderColor: t.cardBorder,
                                            backgroundColor: t.cardBg,
                                        }, children: [state.preview ? (_jsx("img", { src: state.preview, alt: file.name, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center", style: { backgroundColor: t.border }, children: _jsx(ImageIcon, { size: 32, style: { color: t.primary } }) })), _jsx("button", { onClick: () => removeFile(index), className: "absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-80", style: {
                                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                                    backdropFilter: 'blur(4px)',
                                                }, "aria-label": "Remove image", children: _jsx(Trash2, { size: 14, className: "text-white" }) }), isUploading && (_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { size: 24, className: "animate-spin text-white mx-auto mb-2" }), _jsxs("p", { className: "text-white text-xs font-medium", children: [state.progress, "%"] })] }) })), isDone && (_jsx("div", { className: "absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center", children: _jsx("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center", style: {
                                                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                                                    }, children: _jsx("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }) }))] }), (showFileName || showFileSize) && (_jsxs("div", { className: "mt-2 space-y-0.5", children: [showFileName && (_jsx("p", { className: "text-xs font-medium truncate", style: { color: t.text }, children: file.name })), showFileSize && (_jsx("p", { className: "text-xs", style: { color: t.textSecondary }, children: formatFileSize(file.size) }))] }))] }, `${file.name}-${file.size}`));
                        })] }) })), images.length > 0 && !autoUpload && uploadConfig && (_jsxs("div", { className: "mt-6 flex items-center justify-end gap-3", children: [_jsx("button", { onClick: () => {
                            setImages([]);
                            setRemovedDefaults([]);
                        }, className: "px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 hover:bg-opacity-80", style: {
                            backgroundColor: t.cardBg,
                            color: t.text,
                            borderColor: t.cardBorder,
                        }, children: "Clear" }), _jsx("button", { onClick: handleAutoUpload, disabled: uploading, className: "px-4 py-2 text-sm font-medium rounded-md text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2", style: {
                            backgroundColor: t.primary,
                        }, children: uploading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), "Uploading..."] })) : (_jsxs(_Fragment, { children: [_jsx(Upload, { size: 16 }), "Upload ", images.length, " ", images.length === 1 ? 'image' : 'images'] })) })] })), _jsx("style", { children: `
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
      ` })] }));
}
//# sourceMappingURL=ImageUploader.js.map