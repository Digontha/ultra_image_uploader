# Ultra Image Uploader

A modern React component for handling image uploads with drag-and-drop functionality, image preview, and ImgBB integration.

## Features

- 🎯 **Easy Integration** - Simple to use with any React/Next.js project
- 🖼️ **Drag & Drop** - Intuitive drag and drop interface
- 📸 **Image Preview** - Instant preview of uploaded images
- ✨ **Multiple Upload** - Support for multiple image uploads
- 🔍 **File Validation** - Built-in file type and size validation
- 🎨 **Customizable** - Highly customizable styling and components
- 🗑️ **Delete Function** - Easy image removal functionality
- 🔄 **ImgBB Integration** - Built-in support for ImgBB image hosting

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
  const [imageFiles, setImagesFiles] = useState<File[]>([]);

  return (
    <ImageUploader
      images={imageFiles}
      setImages={setImagesFiles}
      mode="add"
      multiple={true}
    />
  );
}
```

### With ImgBB Integration

```tsx
import { ImageUploader, uploadImagesToImageBB } from "ultra-image-uploader";
import { useState } from "react";

function ImageUploadForm() {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetImageUrl = async () => {
    setLoading(true);
    try {
      const result = await uploadImagesToImageBB(
        images,
        "your-imgbb-api-key-here"
      );
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
        mode="add"
        multiple={true}
      />
      <button
        onClick={handleGetImageUrl}
        disabled={loading || images.length === 0}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
}
```

## Component Props

| Prop             | Type                     | Default    | Description |
|------------------|--------------------------|------------|-------------|
| `images`         | `File[]`                 | Required   | Array of selected image files |
| `setImages`      | `(files: File[]) => void`| Required   | Function to update images array |
| `mode`           | `"add" | "update"`      | Required   | Component operation mode |
| `defaultImages`  | `string[]`               | `[]`       | Existing image URLs for update mode |
| `multiple`       | `boolean`                | `false`    | Allow multiple file selection |
| `inputStyles`    | `string`                 | `""`       | Custom CSS classes for upload input |
| `containerStyles`| `string`                 | `""`       | Custom CSS classes for container |
| `uploadText`     | `string`                 | `"Browse files or drag & drop"` | Upload area text |
| `typeText`       | `string`                 | `"PNG, JPG, JPEG, WEBP"` | Allowed file types text |


## ImgBB Utility

The package includes a utility function for uploading to ImgBB:

```ts
interface ImageBBUrlResult {
  urls: string[];
}

async function uploadImagesToImageBB(
  images: File[],
  apiKey: string
): Promise<ImageBBUrlResult>
```

## Development

To contribute to this project:

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn
   ```
3. Make your changes
4. Run the build:
   ```bash
   yarn build
   ```
5. Test your changes
6. Submit a pull request

## License

MIT © Digontha Das

## Support

For support or feature requests, please [open an issue](https://github.com/yourusername/ultra-image-uploader/issues) on GitHub.