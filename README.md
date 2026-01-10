# Ultra Image Uploader

<div align="center">

A modern, beautiful React image upload component with support for multiple providers.

[![npm version](https://badge.fury.io/js/ultra-image-uploader.svg)](https://www.npmjs.com/package/ultra-image-uploader)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

**Modern UI** • **Multiple Providers** • **5 Themes** • **Production Ready**

</div>

---

## Features

- **Beautiful UI** - Modern, clean design with smooth animations
- **5 Built-in Themes** - Light, Dark, Modern, Ocean, Sunset
- **Custom Themes** - Create your own color schemes
- **Multiple Providers** - ImgBB & Cloudinary support
- **Drag & Drop** - Intuitive file handling
- **Upload Progress** - Real-time progress tracking
- **File Validation** - Type and size validation
- **Auto Upload** - Optional automatic uploading
- **TypeScript** - Fully typed
- **Simple API** - Easy to use

## Installation

```bash
npm install ultra-image-uploader
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
      theme="light"
    />
  );
}
```

## Themes

Choose from 5 beautiful themes:

```tsx
// Light (default)
<ImageUploader theme="light" images={images} setImages={setImages} />

// Dark
<ImageUploader theme="dark" images={images} setImages={setImages} />

// Modern (pink)
<ImageUploader theme="modern" images={images} setImages={setImages} />

// Ocean (cyan)
<ImageUploader theme="ocean" images={images} setImages={setImages} />

// Sunset (orange)
<ImageUploader theme="sunset" images={images} setImages={setImages} />
```

## Custom Theme

```tsx
import { ImageUploader, type ThemeConfig } from "ultra-image-uploader";

const customTheme: ThemeConfig = {
  primary: '#ff6b6b',
  background: '#fff',
  border: '#ddd',
  text: '#333',
  textSecondary: '#666',
  error: '#e74c3c',
  success: '#2ecc71',
  radius: '8px',
};

<ImageUploader
  images={images}
  setImages={setImages}
  theme={customTheme}
/>
```

## Upload to ImgBB

```tsx
import { ImageUploader, uploadImagesToImageBB } from "ultra-image-uploader";

function UploadToImgBB() {
  const [images, setImages] = useState<File[]>([]);

  const handleUpload = async () => {
    const result = await uploadImagesToImageBB(images, 'YOUR_API_KEY');
    console.log('Uploaded:', result.urls);
  };

  return (
    <div>
      <ImageUploader images={images} setImages={setImages} multiple />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

## Upload to Cloudinary

```tsx
import { ImageUploader, uploadImagesToCloudinary } from "ultra-image-uploader";

function UploadToCloudinary() {
  const [images, setImages] = useState<File[]>([]);

  const handleUpload = async () => {
    const results = await uploadImagesToCloudinary(images, {
      cloudName: 'your-cloud-name',
      uploadPreset: 'your-upload-preset',
    });
    console.log('Uploaded:', results.map(r => r.url));
  };

  return (
    <div>
      <ImageUploader images={images} setImages={setImages} multiple theme="dark" />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

## Auto Upload Mode

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  multiple
  autoUpload
  uploadConfig={{
    provider: 'imgbb',
    config: { apiKey: 'your-api-key' },
  }}
  onUploadComplete={(urls) => console.log('Done!', urls)}
  onUploadError={(error) => console.error('Error:', error)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `File[]` | **Required** | Selected image files |
| `setImages` | `(files: File[]) => void` | **Required** | Update images state |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `theme` | `'light' \| 'dark' \| 'modern' \| 'ocean' \| 'sunset' \| ThemeConfig` | `'light'` | Theme to use |
| `mode` | `'add' \| 'update'` | `'add'` | Component mode |
| `defaultImages` | `string[]` | `[]` | Existing image URLs |
| `uploadText` | `string` | `'Drop images here...'` | Upload area text |
| `maxSize` | `number` | `10485760` | Max file size (bytes) |
| `allowedTypes` | `string[]` | Image types | Allowed MIME types |
| `showFileSize` | `boolean` | `true` | Show file size |
| `dragAndDrop` | `boolean` | `true` | Enable drag-drop |
| `previewWidth` | `number` | `140` | Preview width (px) |
| `previewHeight` | `number` | `140` | Preview height (px) |
| `autoUpload` | `boolean` | `false` | Auto upload files |
| `uploadConfig` | `{ provider, config }` | `undefined` | Upload config |
| `onUploadComplete` | `(urls: string[]) => void` | `undefined` | Upload success callback |
| `onUploadError` | `(error: Error) => void` | `undefined` | Upload error callback |
| `className` | `string` | `''` | Extra CSS classes |

## Upload Functions

### `uploadImage(file, provider, config, options?)`

Upload a single image.

```tsx
import { uploadImage } from "ultra-image-uploader";

const result = await uploadImage(
  file,
  'imgbb',
  { apiKey: 'your-key' },
  {
    onProgress: (p) => console.log(p.percentage + '%'),
  }
);
console.log(result.url);
```

### `uploadImages(files, provider, config, options?)`

Upload multiple images.

```tsx
const results = await uploadImages(files, 'cloudinary', {
  cloudName: 'your-cloud',
});
```

### `uploadImagesToImageBB(images, apiKey)`

Upload to ImgBB (shorthand).

```tsx
const { urls } = await uploadImagesToImageBB(images, 'api-key');
```

### `uploadImagesToCloudinary(files, config, options?)`

Upload to Cloudinary (shorthand).

```tsx
const results = await uploadImagesToCloudinary(images, {
  cloudName: 'your-cloud',
  uploadPreset: 'your-preset',
});
```

## Get API Keys

### ImgBB
1. Go to [imgbb.com/settings/api](https://imgbb.com/settings/api)
2. Copy your API key

### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name from dashboard
3. Create upload preset (Settings → Upload)

## TypeScript

All types are exported:

```tsx
import type {
  UploadProvider,
  UploadResult,
  ThemeConfig,
  ImageUploaderProps,
  FileValidationOptions,
  // ... more
} from "ultra-image-uploader";
```

## Examples

### Profile Picture

```tsx
<ImageUploader
  images={avatar}
  setImages={setAvatar}
  multiple={false}
  maxSize={2 * 1024 * 1024}
  theme="modern"
/>
```

### Product Gallery

```tsx
<ImageUploader
  images={products}
  setImages={setProducts}
  multiple
  mode="update"
  defaultImages={existingImages}
  allowedTypes={['image/jpeg', 'image/webp']}
  theme="ocean"
/>
```

### Custom Colors

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  theme={{
    primary: '#00d9ff',
    background: '#0a0a0a',
    border: '#333',
    text: '#fff',
    textSecondary: '#999',
    error: '#ff4757',
    success: '#2ed573',
    radius: '16px',
  }}
/>
```

## License

MIT © Digontha Das

## Links

- [GitHub](https://github.com/digontha/ultra-image-uploader)
- [NPM](https://www.npmjs.com/package/ultra-image-uploader)
- [Issues](https://github.com/digontha/ultra-image-uploader/issues)

---

Made with ❤️ by [Digontha Das](https://github.com/digontha)
