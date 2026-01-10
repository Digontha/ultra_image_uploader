# Ultra Image Uploader

<div align="center">

A modern, beautiful React image upload component with progress tracking, drag-and-drop, and multi-provider support.

[![npm version](https://badge.fury.io/js/ultra-image-uploader.svg)](https://www.npmjs.com/package/ultra-image-uploader)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

**Modern UI** • **Progress Bars** • **ImgBB & Cloudinary** • **Auto Import Ready**

</div>

---

## Features

- **Modern UI** - Clean, professional file upload interface matching industry standards
- **Progress Tracking** - Real-time upload progress with smooth animations
- **Drag & Drop** - Intuitive drag-and-drop file handling
- **Multiple Providers** - Built-in support for ImgBB and Cloudinary
- **File Validation** - Type and size validation with helpful error messages
- **Auto Upload** - Optional automatic upload on file selection
- **Cancel/Remove** - Easy file management with cancel buttons
- **TypeScript** - Fully typed for excellent DX
- **Auto Import** - Works seamlessly with VS Code, WebStorm, and all popular editors

## Installation

Install with any package manager:

```bash
# npm
npm install ultra-image-uploader

# yarn
yarn add ultra-image-uploader

# pnpm
pnpm add ultra-image-uploader

# bun
bun add ultra-image-uploader
```

## Quick Start

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function App() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple
    />
  );
}
```

## Usage Examples

### Basic File Upload

```tsx
import { ImageUploader } from "ultra-image-uploader";

function BasicUpload() {
  const [images, setImages] = useState<File[]>([]);

  const handleUploadComplete = (urls: string[]) => {
    console.log('Uploaded URLs:', urls);
  };

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple
      maxSize={50 * 1024 * 1024} // 50MB
      onUploadComplete={handleUploadComplete}
      uploadConfig={{
        provider: 'imgbb',
        config: { apiKey: 'your-api-key' }
      }}
    />
  );
}
```

### Upload with ImgBB

```tsx
import { ImageUploader } from "ultra-image-uploader";

function ImgBBUpload() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <div>
      <ImageUploader
        images={images}
        setImages={setImages}
        multiple
        uploadConfig={{
          provider: 'imgbb',
          config: { apiKey: process.env.IMGBB_API_KEY }
        }}
        onUploadComplete={(urls) => {
          console.log('Images uploaded to ImgBB:', urls);
        }}
      />
    </div>
  );
}
```

### Upload with Cloudinary

```tsx
import { ImageUploader } from "ultra-image-uploader";

function CloudinaryUpload() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple
      uploadConfig={{
        provider: 'cloudinary',
        config: {
          cloudName: 'your-cloud-name',
          uploadPreset: 'your-upload-preset'
        }
      }}
      onUploadComplete={(urls) => {
        console.log('Images uploaded to Cloudinary:', urls);
      }}
    />
  );
}
```

### Auto Upload Mode

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  multiple
  autoUpload
  uploadConfig={{
    provider: 'imgbb',
    config: { apiKey: 'your-api-key' }
  }}
/>
```

### Single File Upload

```tsx
<ImageUploader
  images={avatar}
  setImages={setAvatar}
  multiple={false}
  maxSize={2 * 1024 * 1024} // 2MB
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `File[]` | **Required** | Selected image files |
| `setImages` | `(files: File[]) => void` | **Required** | Update images state |
| `multiple` | `boolean` | `true` | Allow multiple file selection |
| `maxSize` | `number` | `52428800` | Max file size in bytes (50MB) |
| `allowedTypes` | `string[]` | Image types | Allowed MIME types |
| `className` | `string` | `''` | Extra CSS classes |
| `autoUpload` | `boolean` | `false` | Auto-upload on selection |
| `uploadConfig` | `{ provider, config }` | `undefined` | Upload configuration |
| `onUploadComplete` | `(urls: string[]) => void` | `undefined` | Upload success callback |
| `onUploadError` | `(error: Error) => void` | `undefined` | Upload error callback |

## Upload Functions

You can also use the upload functions directly:

```tsx
import {
  uploadImage,
  uploadImages,
  uploadImagesToImageBB,
  uploadImagesToCloudinary
} from "ultra-image-uploader";

// Upload single image
const result = await uploadImage(file, 'imgbb', { apiKey: 'key' });

// Upload multiple images
const results = await uploadImages(files, 'cloudinary', {
  cloudName: 'your-cloud'
});

// Convenience functions
const { urls } = await uploadImagesToImageBB(images, apiKey);
const uploads = await uploadImagesToCloudinary(images, config);
```

## API Configuration

### ImgBB

1. Go to [imgbb.com/settings/api](https://imgbb.com/settings/api)
2. Copy your API key
3. Use in the component:

```tsx
uploadConfig={{
  provider: 'imgbb',
  config: { apiKey: 'your-api-key' }
}}
```

### Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your **cloud name** from dashboard
3. Create an **upload preset** (Settings → Upload → Upload presets)
4. Use in the component:

```tsx
uploadConfig={{
  provider: 'cloudinary',
  config: {
    cloudName: 'your-cloud-name',
    uploadPreset: 'your-upload-preset'
  }
}}
```

## TypeScript

All exports are fully typed:

```tsx
import type {
  ImageUploaderProps,
  UploadProvider,
  UploadResult,
  ProviderConfig,
  UploadOptions
} from "ultra-image-uploader";
```

## Auto Import Support

This package supports auto-import in all major editors:

- **VS Code** - Auto-suggestions work out of the box
- **WebStorm** - Full IntelliSense support
- **Neovim** - Works with LSP and completion plugins
- **Sublime Text** - Works with LSP packages
- **All TypeScript editors** - Full type checking and suggestions

## Styling

The component uses Tailwind CSS classes. You can add custom styling:

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  className="max-w-2xl mx-auto"
/>
```

### Custom Styling

For complete customization, you can wrap and override styles:

```tsx
<div className="your-custom-wrapper">
  <ImageUploader
    images={images}
    setImages={setImages}
    className="your-custom-class"
  />
</div>
```

## Troubleshooting

### Auto imports not working

**VS Code:**
1. Ensure TypeScript is enabled in your project
2. Restart the TypeScript server: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
3. Check that `node_modules/ultra-image-uploader` exists

**WebStorm:**
1. Invalidate caches: `File` → `Invalidate Caches and Restart`
2. Ensure TypeScript plugin is enabled

### Uploads failing

1. **Check API keys** - Verify your ImgBB or Cloudinary credentials
2. **CORS issues** - Ensure your domain is whitelisted
3. **File size** - Check if file exceeds provider limits
4. **Network** - Check browser console for network errors

### TypeScript errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart TypeScript server in your editor
```

### Build issues

```bash
# Clean and rebuild
npm run clean
npm run build
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Requirements

- React >= 18.0.0
- TypeScript (optional but recommended)

## License

MIT © Digontha Das

## Links

- [GitHub](https://github.com/digontha/ultra-image-uploader)
- [NPM](https://www.npmjs.com/package/ultra-image-uploader)
- [Report Issues](https://github.com/digontha/ultra-image-uploader/issues)

## Changelog

### v2.0.0
- 🎨 Modern UI redesign with progress bars
- ✅ Auto import support for all editors
- 📦 Simplified package structure
- 🚀 Improved drag-and-drop experience
- 🎯 Better TypeScript support

---

Made with ❤️ by [Digontha Das](https://github.com/digontha)
