# Ultra Image Uploader

<div align="center">

A modern, fancy React image upload component with responsive grid layout, drag-and-drop reordering, and beautiful animations.

[![npm version](https://badge.fury.io/js/ultra-image-uploader.svg)](https://www.npmjs.com/package/ultra-image-uploader)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

**Modern UI** • **Dark/Light Themes** • **Grid Layout** • **Drag Reorder**

</div>

---

## Features

- **Modern UI** - Beautiful card-based design with shadows and rounded corners
- **Responsive Grid** - Adaptive grid layout (2-6 columns) for all screen sizes
- **Drag & Drop** - Upload files by dragging or clicking
- **Live Previews** - Instant image thumbnails with metadata
- **Drag Reorder** - Rearrange images by dragging
- **Progress Tracking** - Real-time upload progress with animations
- **Theme Support** - Built-in light/dark theme toggle
- **Smooth Animations** - Hover effects, fade transitions, scale animations
- **Keyboard Accessible** - Full keyboard navigation support
- **File Validation** - Size and type validation
- **Multiple Providers** - ImgBB & Cloudinary support
- **Auto Import** - Works with VS Code, WebStorm, and all editors

## Installation

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
      gridCols={4}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `File[]` | **Required** | Selected image files |
| `setImages` | `(files: File[]) => void` | **Required** | Update images state |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `maxSize` | `number` | `52428800` | Max file size (50MB) |
| `allowedTypes` | `string[]` | Image types | Allowed MIME types |
| `maxImages` | `number` | `20` | Maximum images allowed |
| `theme` | `'light' \| 'dark'` | `undefined` | Theme (uses internal if not set) |
| `onThemeChange` | `(theme) => void` | `undefined` | Theme change callback |
| `showThemeToggle` | `boolean` | `true` | Show theme toggle button |
| `showImageCount` | `boolean` | `true` | Show image count header |
| `enableReorder` | `boolean` | `true` | Enable drag reordering |
| `gridCols` | `number` | `4` | Grid columns (2-6) |
| `cardClassName` | `string` | `''` | Custom card class |
| `containerClassName` | `string` | `'max-w-5xl mx-auto'` | Container styling |
| `uploadText` | `string` | `'Click or drag...'` | Upload area text |
| `dragText` | `string` | `'Drop images here'` | Drag over text |
| `autoUpload` | `boolean` | `false` | Auto-upload on selection |
| `uploadConfig` | `{ provider, config }` | `undefined` | Upload configuration |
| `onUploadComplete` | `(urls: string[]) => void` | `undefined` | Success callback |
| `onUploadError` | `(error: Error) => void` | `undefined` | Error callback |

## Examples

### Basic Grid Layout

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  multiple
  gridCols={4}
/>
```

### Dark Theme

```tsx
function DarkExample() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [images, setImages] = useState<File[]>([]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <ImageUploader
        images={images}
        setImages={setImages}
        theme={theme}
        onThemeChange={setTheme}
        multiple
        gridCols={3}
      />
    </div>
  );
}
```

### Custom Grid & Styling

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  gridCols={3}
  maxImages={10}
  maxSize={10 * 1024 * 1024}
  containerClassName="max-w-4xl mx-auto"
  cardClassName="border-2"
/>
```

### Without Reordering

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  enableReorder={false}
  gridCols={5}
/>
```

### With Upload (ImgBB)

```tsx
function UploadExample() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple
      gridCols={4}
      uploadConfig={{
        provider: 'imgbb',
        config: { apiKey: process.env.IMGBB_API_KEY }
      }}
      onUploadComplete={(urls) => {
        console.log('Uploaded:', urls);
      }}
    />
  );
}
```

### Responsive Grid

```tsx
// 2 columns on mobile, 4 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <ImageUploader images={images} setImages={setImages} gridCols={1} />
</div>
```

## Theme Support

The component includes built-in light and dark themes:

```tsx
// Controlled theme
<ImageUploader
  images={images}
  setImages={setImages}
  theme="dark"
  showThemeToggle={false}
/>

// Uncontrolled theme (with toggle)
<ImageUploader
  images={images}
  setImages={setImages}
  showThemeToggle={true}
/>
```

## Animations

The component includes smooth animations:
- Scale effect on drag over
- Fade-in/out for previews
- Hover scale on image cards
- Smooth progress bar transitions
- Button hover effects

## Accessibility

- Keyboard accessible (Enter/Space to upload)
- Focus indicators on drag area
- ARIA-compatible markup
- Screen reader friendly

## Responsive Design

The grid layout adapts to screen sizes:
- Default: `max-w-5xl mx-auto` container
- Configurable grid columns (2-6)
- Works on mobile, tablet, and desktop

## Upload Functions

```tsx
import {
  uploadImage,
  uploadImages,
  uploadImagesToImageBB,
  uploadImagesToCloudinary
} from "ultra-image-uploader";

// Upload with progress
const result = await uploadImage(file, 'imgbb', { apiKey }, {
  onProgress: (p) => console.log(p.percentage)
});

// Multiple uploads
const results = await uploadImages(files, 'cloudinary', {
  cloudName: 'your-cloud'
});
```

## API Configuration

### ImgBB
1. Get API key from [imgbb.com/settings/api](https://imgbb.com/settings/api)
2. Use `{ provider: 'imgbb', config: { apiKey } }`

### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get cloud name and create upload preset
3. Use `{ provider: 'cloudinary', config: { cloudName, uploadPreset } }`

## Customization

### Card Styling

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  cardClassName="border-2 border-purple-500"
/>
```

### Container Size

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  containerClassName="max-w-7xl mx-auto"
/>
```

### Grid Columns

```tsx
// 2 columns
<ImageUploader gridCols={2} />

// 6 columns
<ImageUploader gridCols={6} />
```

## TypeScript

Full TypeScript support:

```tsx
import type { ImageUploaderProps } from "ultra-image-uploader";
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Auto imports not working
- Restart TypeScript server in your editor
- Ensure `node_modules` exists

### Theme not applying
- Wrap parent div with `dark` class for dark mode
- Check Tailwind CSS dark mode config

### Grid not responsive
- Adjust `gridCols` prop for different breakpoints
- Use wrapper with responsive classes

## License

MIT © Digontha Das

## Links

- [GitHub](https://github.com/digontha/ultra-image-uploader)
- [NPM](https://www.npmjs.com/package/ultra-image-uploader)
- [Issues](https://github.com/digontha/ultra-image-uploader/issues)

---

Made with ❤️ by [Digontha Das](https://github.com/digontha)
