# Ultra Image Uploader

<div align="center">

A modern, feature-rich React image upload component with support for multiple hosting providers.

[![npm version](https://badge.fury.io/js/ultra-image-uploader.svg)](https://www.npmjs.com/package/ultra-image-uploader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Features** • **Multiple Providers** • **Themeable** • **TypeScript** • **Production Ready**

</div>

---

## Features

- **Multiple Provider Support** - Built-in support for ImgBB and Cloudinary
- **Drag & Drop** - Intuitive drag and drop interface
- **Upload Progress** - Real-time upload progress tracking
- **File Validation** - Comprehensive file type, size, and dimension validation
- **Theme System** - 5 built-in themes + custom theme support
- **Auto Upload** - Optional automatic upload on file selection
- **Image Preview** - Instant preview with file size display
- **Error Handling** - Graceful error handling with user feedback
- **TypeScript** - Fully typed for excellent developer experience
- **Customizable** - Highly customizable styling and behavior
- **Tree Shakeable** - Optimized bundle size

## Installation

```bash
npm install ultra-image-uploader
# or
yarn add ultra-image-uploader
# or
pnpm add ultra-image-uploader
```

## Quick Start

### Basic Usage

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function App() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple={true}
      theme="light"
    />
  );
}
```

### With ImgBB Upload

```tsx
import { ImageUploader, uploadImagesToImageBB } from "ultra-image-uploader";
import { useState } from "react";

function ImageUploadForm() {
  const [images, setImages] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const result = await uploadImagesToImageBB(
        images,
        "your-imgbb-api-key-here"
      );
      setUploadedUrls(result.urls);
      console.log("Uploaded URLs:", result.urls);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ImageUploader
        images={images}
        setImages={setImages}
        multiple={true}
        theme="modern"
      />
      <button
        onClick={handleUpload}
        disabled={loading || images.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload to ImgBB"}
      </button>

      {uploadedUrls.length > 0 && (
        <div>
          <h3>Uploaded Images:</h3>
          {uploadedUrls.map((url) => (
            <img key={url} src={url} alt="Uploaded" />
          ))}
        </div>
      )}
    </div>
  );
}
```

### With Cloudinary

```tsx
import { ImageUploader, uploadImagesToCloudinary } from "ultra-image-uploader";
import { useState } from "react";

function CloudinaryUpload() {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const results = await uploadImagesToCloudinary(
        images,
        {
          cloudName: "your-cloud-name",
          uploadPreset: "your-upload-preset", // for unsigned uploads
        },
        {
          onProgress: (progress) => {
            console.log(`Upload: ${progress.percentage}%`);
          },
          transformOptions: {
            width: 800,
            height: 600,
            crop: "limit",
            quality: 80,
          },
        }
      );
      console.log("Uploaded:", results);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ImageUploader
        images={images}
        setImages={setImages}
        multiple={true}
        theme="dark"
      />
      <button onClick={handleUpload} disabled={loading}>
        Upload to Cloudinary
      </button>
    </div>
  );
}
```

### Auto Upload Mode

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function AutoUploadExample() {
  const [images, setImages] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple={true}
      autoUpload={true}
      uploadConfig={{
        provider: "imgbb",
        config: { apiKey: "your-api-key" },
      }}
      onUploadComplete={(urls) => {
        setUploadedUrls(urls);
        console.log("All uploads complete!", urls);
      }}
      onUploadError={(error) => {
        console.error("Upload failed:", error);
      }}
      theme="colorful"
    />
  );
}
```

## Theming

### Built-in Themes

The component comes with 5 beautiful themes:

- **`light`** - Clean and modern light theme
- **`dark`** - Sleek dark theme
- **`modern`** - Purple-themed modern design
- **`minimal`** - Minimalist black and white
- **`colorful`** - Warm amber/yellow theme

```tsx
<ImageUploader images={images} setImages={setImages} theme="dark" />
```

### Custom Theme

Create your own theme with full customization:

```tsx
import { ImageUploader, type UploaderTheme } from "ultra-image-uploader";

const customTheme: UploaderTheme = {
  primary: "#ff6b6b",
  primaryHover: "#ee5a5a",
  background: "#f7f7f7",
  border: "#ddd",
  text: "#333",
  textSecondary: "#666",
  error: "#e74c3c",
  success: "#2ecc71",
  radius: "8px",
};

<ImageUploader
  images={images}
  setImages={setImages}
  customTheme={customTheme}
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `File[]` | **Required** | Array of selected image files |
| `setImages` | `(files: File[]) => void` | **Required** | Function to update images array |
| `mode` | `'add' \| 'update'` | `'add'` | Component operation mode |
| `defaultImages` | `string[]` | `[]` | Existing image URLs for update mode |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `theme` | `ThemePreset` | `'light'` | Built-in theme to use |
| `customTheme` | `UploaderTheme` | `undefined` | Custom theme configuration |
| `uploadText` | `string` | `'Drop images here...'` | Upload area text |
| `typeText` | `string` | `'PNG, JPG,...'` | File type hint text |
| `maxSize` | `number` | `10485760` | Max file size in bytes (10MB) |
| `allowedTypes` | `string[]` | `['image/jpeg', ...]` | Allowed MIME types |
| `showFileSize` | `boolean` | `true` | Show file size on preview |
| `dragAndDrop` | `boolean` | `true` | Enable drag and drop |
| `previewWidth` | `number` | `150` | Preview image width in px |
| `previewHeight` | `number` | `150` | Preview image height in px |
| `className` | `string` | `''` | Additional CSS classes |
| `autoUpload` | `boolean` | `false` | Auto-upload on file selection |
| `uploadConfig` | `{ provider, config }` | `undefined` | Upload configuration |
| `onUploadComplete` | `(urls: string[]) => void` | `undefined` | Callback on upload success |
| `onUploadError` | `(error: Error) => void` | `undefined` | Callback on upload error |

## Upload Providers

### ImgBB

Free image hosting with simple API:

```tsx
import { uploadImagesToImageBB } from "ultra-image-uploader";

const result = await uploadImagesToImageBB(
  images,
  "your-imgbb-api-key"
);
console.log(result.urls);
```

**Get API Key:** [imgbb.com/settings/api](https://imgbb.com/settings/api)

### Cloudinary

Enterprise-grade image hosting with transformations:

```tsx
import { uploadImagesToCloudinary } from "ultra-image-uploader";

const results = await uploadImagesToCloudinary(
  images,
  {
    cloudName: "your-cloud-name",
    uploadPreset: "your-upload-preset", // optional
  },
  {
    onProgress: (progress) => console.log(progress.percentage),
    transformOptions: {
      width: 800,
      height: 600,
      quality: 85,
      crop: "limit",
    },
  }
);
```

**Get Credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name from dashboard
3. Create an upload preset (Settings → Upload → Upload presets)

## Advanced Usage

### Custom Provider

You can create custom upload providers:

```tsx
import { BaseImageProvider } from "ultra-image-uploader";

class CustomProvider extends BaseImageProvider {
  name = 'custom' as const;

  async upload(file: File, config: ProviderConfig) {
    // Your upload logic here
    return {
      url: "https://...",
      provider: "custom",
      originalFile: file,
    };
  }

  async uploadMultiple(files: File[], config: ProviderConfig) {
    return Promise.all(files.map(f => this.upload(f, config)));
  }
}

// Register and use
import { providerRegistry } from "ultra-image-uploader";
providerRegistry.register(new CustomProvider());
```

### File Validation

```tsx
import {
  validateImageFile,
  validateFileComplete,
  formatFileSize,
} from "ultra-image-uploader";

// Quick validation
const validation = validateImageFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png"],
});

if (!validation.valid) {
  console.error("Errors:", validation.errors);
}

// Complete validation (with dimensions)
const completeValidation = await validateFileComplete(file, {
  maxSize: 10 * 1024 * 1024,
  minWidth: 800,
  maxWidth: 4000,
  minHeight: 600,
  maxHeight: 3000,
});
```

### Transforming Cloudinary Images

Generate transformed URLs for existing Cloudinary images:

```tsx
import { CloudinaryProvider } from "ultra-image-uploader";

const transformedUrl = CloudinaryProvider.generateTransformedUrl(
  "https://res.cloudinary.com/.../image.jpg",
  {
    width: 400,
    height: 300,
    crop: "fill",
    quality: 80,
    format: "webp",
  }
);
```

## TypeScript Support

The package is fully typed. Import types as needed:

```tsx
import type {
  UploadProvider,
  UploadResult,
  ProviderConfig,
  UploadOptions,
  ImageUploaderProps,
  UploaderTheme,
  ValidationResult,
  FileValidationOptions,
} from "ultra-image-uploader";
```

## Examples

### E-commerce Product Image Upload

```tsx
function ProductImageUpload() {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([
    "https://example.com/product1.jpg",
  ]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      mode="update"
      defaultImages={existingImages}
      multiple={true}
      maxSize={5 * 1024 * 1024} // 5MB
      allowedTypes={["image/jpeg", "image/webp"]}
      theme="modern"
      previewWidth={200}
      previewHeight={200}
    />
  );
}
```

### Profile Picture Upload

```tsx
function ProfilePicUpload() {
  const [avatar, setAvatar] = useState<File[]>([]);

  return (
    <ImageUploader
      images={avatar}
      setImages={setAvatar}
      multiple={false}
      maxSize={2 * 1024 * 1024} // 2MB
      previewWidth={180}
      previewHeight={180}
      theme="minimal"
    />
  );
}
```

## Migration from v0.0.x

If you're upgrading from version 0.0.x, the API is backward compatible:

```tsx
// Old API still works
import { uploadImagesToImageBB } from "ultra-image-uploader";
const { urls } = await uploadImagesToImageBB(images, apiKey);

// But you can now use the new provider-agnostic API
import { uploadImages } from "ultra-image-uploader";
const results = await uploadImages(images, "imgbb", { apiKey });
const urls = results.map(r => r.url);
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT © Digontha Das

## Support & Contributing

- **Issues:** [GitHub Issues](https://github.com/digontha/ultra-image-uploader/issues)
- **Contributing:** Pull requests are welcome!
- **Discussions:** Ask questions and share ideas

---

Made with ❤️ by [Digontha Das](https://github.com/digontha)
