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
npm install ultra_image_uploader
# or
yarn add ultra_image_uploader
# or
pnpm add ultra_image_uploader
```

## Quick Start

### Basic Usage

```tsx
import { ImageUploader, imageUrl } from 'ultra_image_uploader';
import { useState } from 'react';

function App() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      mode="add"
      multiple={true}
    />
  );
}
```

### With ImgBB Integration

```tsx
import { ImageUploader, imageUrl } from 'ultra_image_uploader';
import { useState } from 'react';

function ImageUploadForm() {
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async () => {
    try {
      const uploadedUrls = await imageUrl(images, 'YOUR_IMGBB_API_KEY');
      console.log('Uploaded image URLs:', uploadedUrls);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUploader
        images={images}
        setImages={setImages}
        mode="add"
        multiple={true}
      />
      <button type="submit">Upload Images</button>
    </form>
  );
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `File[]` | Required | Array of selected image files |
| `setImages` | `(images: File[]) => void` | Required | Function to update images array |
| `mode` | `"add" \| "update"` | Required | Mode of operation |
| `defaultImages` | `string[]` | `[]` | Array of existing image URLs |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `maxFileSize` | `number` | `5242880` | Maximum file size in bytes (5MB) |
| `allowedFileTypes` | `string[]` | `["image/jpeg", "image/png"]` | Allowed MIME types |
| `containerClassName` | `string` | `""` | Custom container class |
| `uploadBoxClassName` | `string` | `""` | Custom upload box class |
| `imageClassName` | `string` | `""` | Custom image preview class |
| `uploadBoxStyle` | `React.CSSProperties` | `{}` | Custom upload box styles |
| `imageStyle` | `React.CSSProperties` | `{}` | Custom image preview styles |
| `uploadIcon` | `React.ReactNode` | `<UploadCloudIcon />` | Custom upload icon |
| `deleteIcon` | `React.ReactNode` | `<TrashIcon />` | Custom delete icon |
| `uploadText` | `string` | `"Choose files to upload"` | Upload box text |
| `dragAndDropText` | `string` | `"Drag and drop files here"` | Drag and drop text |
| `fileTypeText` | `string` | `"PNG, JPG, or JPEG files"` | File type info text |
| `onUpload` | `(files: File[]) => void` | - | Upload callback |
| `onRemove` | `(file: File, index: number) => void` | - | Remove callback |
| `onFileValidationError` | `(error: string) => void` | - | Validation error callback |

## Usage Examples

### Add Mode (New Upload)

```tsx
import { ImageUploader, imageUrl } from 'ultra_image_uploader';

function AddImage() {
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async () => {
    const imgUrls = await imageUrl(images, 'YOUR_IMGBB_API_KEY');
    // Handle the uploaded image URLs
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUploader
        images={images}
        setImages={setImages}
        mode="add"
        multiple={true}
        uploadBoxClassName="border-3 border-dashed p-5"
        imageClassName="w-20 h-20"
      />
      <button type="submit">Upload</button>
    </form>
  );
}
```

### Update Mode (Edit Existing Images)

```tsx
function UpdateImage() {
  const [images, setImages] = useState<File[]>([]);
  const existingImages = ['https://example.com/image1.jpg'];

  const handleSubmit = async () => {
    const newImgUrls = await imageUrl(images, 'YOUR_IMGBB_API_KEY');
    // Combine existing and new images
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUploader
        images={images}
        setImages={setImages}
        mode="update"
        multiple={true}
        defaultImages={existingImages}
        uploadBoxClassName="border-3 border-dashed p-5"
        imageClassName="w-20 h-20"
      />
      <button type="submit">Update</button>
    </form>
  );
}
```

## Styling

The component uses Tailwind CSS classes by default but can be customized using className props:

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  mode="add"
  containerClassName="max-w-2xl mx-auto"
  uploadBoxClassName="border-2 border-dashed border-blue-500 rounded-lg"
  imageClassName="rounded-lg shadow-md"
/>
```

## ImgBB Integration

The package includes a utility function `imageUrl` for uploading images to ImgBB:

```typescript
const uploadImages = async (files: File[]) => {
  try {
    const urls = await imageUrl(files, 'YOUR_IMGBB_API_KEY');
    console.log('Uploaded URLs:', urls);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.