# Ultra Image Uploader

<div align="center">

A modern, production-ready React image upload component with shadcn/ui-inspired design, beautiful themes, and smooth animations.

[![npm version](https://badge.fury.io/js/ultra-image-uploader.svg)](https://www.npmjs.com/package/ultra-image-uploader)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

**shadcn/ui Design** • **5 Themes** • **ImgBB & Cloudinary** • **Customizable**

</div>

---

## Features

- **Modern UI** - Clean, minimal shadcn/ui-inspired design
- **5 Built-in Themes** - Nature, Modern, Fresh, Dark (gradient), Ocean (blue gradient)
- **Drag & Drop** - Beautiful drag-and-drop with smooth animations
- **Live Previews** - Responsive grid with image thumbnails
- **Progress Tracking** - Real-time upload progress with visual feedback
- **Remove Images** - Easy removal with trash icon in both create and update modes
- **Error Handling** - Built-in API key validation and error display with dismissible alerts
- **Custom Themes** - Create your own theme with custom colors
- **Multiple Providers** - ImgBB & Cloudinary support
- **File Validation** - Size, type, and count validation
- **Accessible** - Keyboard navigation and ARIA support
- **Auto Import** - Works with VS Code, WebStorm, and all editors
- **Customization API** - Border radius, preview size (xs to 2xl), show/hide elements
- **Custom Text Labels** - Fully customizable text labels for internationalization
- **Custom Upload Button** - Use your own button component with optional drag-and-drop area

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

  return <ImageUploader images={images} setImages={setImages} multiple />;
}
```

## Props

| Prop                    | Type                                                   | Default                     | Description                     |
| ----------------------- | ------------------------------------------------------ | --------------------------- | ------------------------------- |
| **Core**                |
| `images`                | `File[]`                                               | **Required**                | Selected image files            |
| `setImages`             | `(files: File[]) => void`                              | **Required**                | Update images state             |
| **Text Labels**         |
| `textLabels`            | `ImageUploaderTextLabels`                              | `undefined`                 | Custom text labels (i18n)       |
| **Mode**                |
| `mode`                  | `'add' \| 'update'`                                    | `'add'`                     | Upload mode                     |
| `defaultImages`         | `string[]`                                             | `[]`                        | Default images (update mode)    |
| **File Constraints**    |
| `multiple`              | `boolean`                                              | `true`                      | Allow multiple files            |
| `maxSize`               | `number`                                               | `52428800`                  | Max file size (50MB)            |
| `allowedTypes`          | `string[]`                                             | Image types                 | Allowed MIME types              |
| `maxImages`             | `number`                                               | `20`                        | Maximum images allowed          |
| **Upload**              |
| `uploadConfig`          | `{ provider, config }`                                 | `undefined`                 | Upload configuration            |
| `autoUpload`            | `boolean`                                              | `false`                     | Auto-upload on selection        |
| `onUploadComplete`      | `(urls: string[]) => void`                             | `undefined`                 | Success callback                |
| `onUploadError`         | `(error: Error) => void`                               | `undefined`                 | Error callback                  |
| **Theme & Styling**     |
| `theme`                 | `'nature' \| 'modern' \| 'fresh' \| 'dark' \| 'ocean'` | `'nature'`                  | Built-in theme                  |
| `customTheme`           | `Theme`                                                | `undefined`                 | Custom theme object             |
| `showThemeSelector`     | `boolean`                                              | `false`                     | Show theme selector             |
| `borderRadius`          | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`             | `'md'`                      | Border radius                   |
| `previewSize`           | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`        | `'lg'`                      | Upload icon size                |
| `className`             | `string`                                               | `''`                        | Custom class name               |
| `containerClassName`    | `string`                                               | `'max-w-5xl mx-auto mt-10'` | Container styling               |
| **UI Toggles**          |
| `showImageCount`        | `boolean`                                              | `true`                      | Show image count badge          |
| `showFileName`          | `boolean`                                              | `true`                      | Show file name under preview    |
| `showFileSize`          | `boolean`                                              | `true`                      | Show file size under preview    |
| **Custom Button**       |
| `customUploadButton`    | `React.ReactNode`                                      | `undefined`                 | Custom upload button component  |
| `hideDefaultUploadArea` | `boolean`                                              | `false`                     | Hide default upload area        |
| `onUploadClick`         | `() => void`                                           | `undefined`                 | Callback when upload is clicked |

## Text Labels Interface

The `textLabels` prop allows you to customize all text labels in the component for internationalization or custom messaging:

```tsx
interface ImageUploaderTextLabels {

  // Upload area text
  uploadAreaText?: string;
  uploadAreaDragText?: string;

  // Button text
  uploadButton?: string;
  uploadingButton?: string;

  // Image count
  imageCountLabel?: string;

  // Accessibility
  removeImageLabel?: string;
  uploadImagesLabel?: string;
  dismissErrorLabel?: string;

  // Error messages
  uploadErrorTitle?: string;
  uploadErrorMissingImgBBKey?: string;
  uploadErrorMissingImgBBKeyEmpty?: string;
  uploadErrorMissingCloudinaryName?: string;
  uploadErrorMissingCloudinaryNameEmpty?: string;
}
```

## Examples

### Basic Usage

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function App() {
  const [images, setImages] = useState<File[]>([]);

  return <ImageUploader images={images} setImages={setImages} multiple />;
}
```

### Custom Text Labels (Internationalization)

Customize all text labels for internationalization or custom messaging:

```tsx
import { ImageUploader } from "ultra-image-uploader";

function SpanishExample() {
  const [images, setImages] = useState<File[]>([]);

  const textLabels = {
    title: "Subir Imágenes",
    uploadAreaText: "Haz clic o arrastra para subir",
    uploadAreaDragText: "Soltar aquí",
    uploadButton: "Subir",
    uploadingButton: "Subiendo...",
    removeImageLabel: "Eliminar imagen",
    dismissErrorLabel: "Descartar",
    uploadErrorTitle: "Error de Subida",
    uploadErrorMissingImgBBKey:
      "Falta la clave API de ImgBB. Proporciona una clave válida.",
    uploadErrorMissingImgBBKeyEmpty: "La clave API de ImgBB no puede estar vacía.",
    uploadErrorMissingCloudinaryName:
      "Falta el nombre de nube de Cloudinary. Proporciona un nombre válido.",
    uploadErrorMissingCloudinaryNameEmpty:
      "El nombre de nube de Cloudinary no puede estar vacío.",
  };

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      textLabels={textLabels}
      multiple
    />
  );
}
```

### Partial Custom Labels

You only need to override the labels you want to change:

```tsx
function PartialCustomLabelExample() {
  const [images, setImages] = useState<File[]>([]);

  const textLabels = {
    uploadButton: "Upload Photos",
    uploadingButton: "Uploading your photos...",
    uploadAreaText: "Click here or drop images",
  };

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      textLabels={textLabels}
    />
  );
}
```

### Different Themes

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function BasicExample() {
  const [images, setImages] = useState<File[]>([]);

  return <ImageUploader images={images} setImages={setImages} multiple />;
}
```

### Different Themes

```tsx
// Nature theme (green) - Default
<ImageUploader theme="nature" images={images} setImages={setImages} containerClassName="w-full max-w-2xl mx-auto"/>

// Modern theme (neutral/monochrome)
<ImageUploader theme="modern" images={images} setImages={setImages} containerClassName="w-full max-w-2xl mx-auto"/>

// Fresh theme (blue)
<ImageUploader theme="fresh" images={images} setImages={setImages} containerClassName="w-full max-w-2xl mx-auto"/>

// Dark theme (dark gradient with blue accent)
<ImageUploader theme="dark" images={images} setImages={setImages} containerClassName="w-full max-w-2xl mx-auto"/>

// Ocean theme (blue gradient)
<ImageUploader theme="ocean" images={images} setImages={setImages} containerClassName="w-full max-w-2xl mx-auto"/>
```

### Upload with ImgBB

```tsx
import { ImageUploader } from "ultra-image-uploader";

function ImgBBUpload() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple
      theme="nature"
      uploadConfig={{
        provider: "imgbb",
        config: { apiKey: process.env.IMGBB_API_KEY! },
      }}
      onUploadComplete={(urls) => {
        console.log("Uploaded URLs:", urls);
      }}
      onUploadError={(error) => {
        console.error("Upload failed:", error.message);
      }}
    />
  );
}
```

### Upload with Cloudinary

```tsx
function CloudinaryUpload() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      multiple
      theme="fresh"
      uploadConfig={{
        provider: "cloudinary",
        config: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        },
      }}
      onUploadComplete={(urls) => {
        console.log("Uploaded URLs:", urls);
      }}
    />
  );
}
```

### Auto Upload

```tsx
function AutoUploadExample() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      autoUpload
      uploadConfig={{
        provider: "imgbb",
        config: { apiKey: process.env.IMGBB_API_KEY! },
      }}
      onUploadComplete={(urls) => {
        // Automatically upload when images are selected
        saveUrlsToDatabase(urls);
      }}
    />
  );
}
```

### Update Mode (Existing Images)

```tsx
function UpdateExample() {
  const [newImages, setNewImages] = useState<File[]>([]);

  const existingImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
  ];

  return (
    <ImageUploader
      images={newImages}
      setImages={setNewImages}
      mode="update"
      defaultImages={existingImages}
      theme="modern"
      multiple
    />
  );
}
```

### Custom Theme

```tsx
import { ImageUploader, type CustomTheme } from "ultra-image-uploader";

function CustomThemeExample() {
  const [images, setImages] = useState<File[]>([]);

  const customTheme: CustomTheme = {
    name: "MyBrand",
    colors: {
      primary: "#FF6B35",
      primaryHover: "#E55A2B",
      background: "#FFF5F0",
      border: "#FFE5D9",
      text: "#2D3142",
      textSecondary: "#4F5D75",
      cardBg: "#FFFFFF",
      cardBorder: "#FFE5D9",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  };

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      customTheme={customTheme}
      showThemeSelector={false}
    />
  );
}
```

### Customization Options

```tsx
function CustomizedExample() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      // Border radius
      borderRadius="lg"
      // Preview size (affects upload icon)
      previewSize="lg"
      // Container width
      containerClassName="max-w-3xl mx-auto mt-8"
      // Show/hide elements
      showImageCount={true}
      showFileName={true}
      showFileSize={true}
      // Constraints
      multiple={true}
      maxImages={10}
      maxSize={10 * 1024 * 1024} // 10MB
      // Theme
      theme="fresh"
    />
  );
}
```

### Single Image Upload

```tsx
function SingleImageExample() {
  const [avatar, setAvatar] = useState<File[]>([]);

  return (
    <ImageUploader
      images={avatar}
      setImages={setAvatar}
      multiple={false}
      maxImages={1}
      theme="modern"
      showImageCount={false}
      showFileName={false}
      showFileSize={false}
    />
  );
}
```

### Product Gallery

```tsx
function ProductGallery() {
  const [productImages, setProductImages] = useState<File[]>([]);

  const handleUploadComplete = async (urls: string[]) => {
    // Save to database
    await fetch("/api/products/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: urls }),
    });
  };

  return (
    <ImageUploader
      images={productImages}
      setImages={setProductImages}
      multiple={true}
      maxImages={8}
      maxSize={5 * 1024 * 1024} // 5MB
      theme="nature"
      borderRadius="lg"
      uploadConfig={{
        provider: "cloudinary",
        config: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
          uploadPreset: "products",
        },
      }}
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### Custom Upload Button

Use your own button for triggering image upload:

```tsx
function CustomButtonExample() {
  const [images, setImages] = useState<File[]>([]);

  const customButton = (
    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
      📷 Choose Images
    </button>
  );

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      customUploadButton={customButton}
      hideDefaultUploadArea={true}
      onUploadClick={() => console.log("Upload clicked!")}
    />
  );
}
```

### Custom Button with Default Upload Area

Show both your custom button AND the default drag-and-drop area:

```tsx
function HybridExample() {
  const [images, setImages] = useState<File[]>([]);

  const quickUploadBtn = (
    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium">
      Quick Upload
    </button>
  );

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      customUploadButton={quickUploadBtn}
      // Don't hide the default area - users get both options!
    />
  );
}
```

## Built-in Themes

### Nature (Green)

- Soft greens with organic feel
- Primary: `#16a34a`
- Background: `#f0fdf4`
- Perfect for: Nature, health, eco-friendly apps

### Modern (Neutral)

- Clean monochrome design
- Primary: `#09090b`
- Background: `#fafafa`
- Perfect for: Professional apps, portfolios, dashboards

### Fresh (Blue)

- Light blue airy design
- Primary: `#0284c7`
- Background: `#f0f9ff`
- Perfect for: Social apps, SaaS, modern web apps

### Dark (Dark Gradient)

- Dark gradient with blue accent
- Primary: `#3b82f6`
- Background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`
- Perfect for: Dark mode apps, modern interfaces

### Ocean (Blue Gradient)

- Beautiful blue to purple gradient
- Primary: `#06b6d4`
- Background: `linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)`
- Perfect for: Creative apps, vibrant interfaces

## Customization

### Border Radius Options

```tsx
borderRadius = "none"; // 0
borderRadius = "sm"; // 0.25rem
borderRadius = "md"; // 0.375rem (default)
borderRadius = "lg"; // 0.5rem
borderRadius = "full"; // 9999px (circular)
```

### Preview Size Options

```tsx
previewSize = "xs"; // Extra small (40px)
previewSize = "sm"; // Small (48px)
previewSize = "md"; // Medium (56px)
previewSize = "lg"; // Large (64px) - default
previewSize = "xl"; // Extra large (80px)
previewSize = "2xl"; // Double extra large (96px)
```

### Show/Hide Elements

```tsx
<ImageUploader
  showImageCount={false} // Hide image count badge
  showFileName={false} // Hide file names
  showFileSize={false} // Hide file sizes
/>
```

## Upload Providers

### ImgBB

1. Get API key from [imgbb.com/settings/api](https://imgbb.com/settings/api)
2. Configure:

```tsx
uploadConfig={{
  provider: 'imgbb',
  config: { apiKey: 'your-api-key' }
}}
```

### Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get cloud name and create upload preset
3. Configure:

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

Full TypeScript support:

```tsx
import type {
  ImageUploaderProps,
  ThemeName,
  CustomTheme,
} from "ultra-image-uploader";
```

## Animations

The component includes smooth, performance-friendly animations:

- Drag-over state with border color change
- Fade-in for image previews
- Hover effects with shadow and scale
- Progress overlay with backdrop blur
- Done indicator with checkmark
- All transitions use CSS transforms for 60fps performance

## Accessibility

- Keyboard accessible (Tab to focus, Enter/Space to upload)
- Focus visible on drag area
- ARIA-compatible markup
- Screen reader friendly
- Semantic HTML structure

## Responsive Design

The grid layout adapts to screen sizes:

- Mobile (2 columns): 320px+
- Tablet (3 columns): 640px+
- Desktop (4 columns): 768px+
- Wide (5 columns): 1024px+
- Default container: `max-w-5xl mx-auto mt-10`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Error Handling

The component includes built-in API key validation and displays errors inline:

### API Key Validation

If your API key is missing or invalid, the component will automatically display an error message:

**ImgBB Errors:**

- "ImgBB API key is missing. Please provide a valid API key in the uploadConfig."
- "ImgBB API key cannot be empty."

**Cloudinary Errors:**

- "Cloudinary cloud name is missing. Please provide a valid cloud name in the uploadConfig."
- "Cloudinary cloud name cannot be empty."

### Error Display

Errors appear in a dismissible alert box below the header with:

- Red error icon
- Clear error message
- Dismiss button to clear the error

### Handling Upload Errors

You can also handle errors programmatically using the `onUploadError` callback:

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  uploadConfig={{
    provider: "imgbb",
    config: { apiKey: process.env.IMGBB_API_KEY! },
  }}
  onUploadError={(error) => {
    console.error("Upload failed:", error);
    // Show custom notification
    toast.error(error.message);
  }}
/>
```

## Troubleshooting

### Auto imports not working

- Restart TypeScript server in your editor (Cmd+Shift+P > "Restart TypeScript Server")
- Ensure `node_modules` exists (`npm install`)

### Images not uploading

- Verify API credentials in environment variables
- Check browser console for errors
- Ensure CORS is configured for your upload provider
- Look for inline error messages in the component

### Theme not applying

- Check that theme name matches: `'nature'` | `'modern'` | `'fresh'` | `'dark'` | `'ocean'`
- For custom themes, verify the structure matches `CustomTheme` type

## License

MIT © Digontha Das

## Links

- [GitHub](https://github.com/digontha/ultra-image-uploader)
- [NPM](https://www.npmjs.com/package/ultra-image-uploader)
- [Issues](https://github.com/digontha/ultra-image-uploader/issues)

---

Made with ❤️ by [Digontha Das](https://github.com/digontha)
