# ProImageUploader - React Image Upload Component

<div align="center">

![npm](https://img.shields.io/npm/v/ultra_image_uploader)
![license](https://img.shields.io/npm/l/ultra_image_uploader)

</div>

<p align="center">A flexible, customizable React component for handling image uploads with drag-and-drop support, file validation, and preview capabilities.</p>

## ✨ Features

- 🖼️ Drag-and-drop image upload
- ✅ File type and size validation
- 📸 Image previews
- 🔄 Two modes: "add" (new images only) and "update" (with existing images)
- 🎨 Fully customizable styling
- 🗑️ Delete/remove functionality
- 📱 Responsive design
- 🔍 TypeScript support

## 📦 Installation

```bash
npm install ultra_image_uploader
# or
yarn add ultra_image_uploader
```

## 🚀 Basic Usage

```tsx
import ImageUploader from 'ultra_image_uploader';

function MyComponent() {
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

## 🛠️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `File[]` | `[]` | Array of uploaded files |
| `setImages` | `(files: File[]) => void` | - | Function to update the files array |
| `mode` | `"add" \| "update"` | - | Determines if showing existing images |
| `defaultImages` | `string[]` | `[]` | URLs of existing images (for "update" mode) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `maxFileSize` | `number` | `5MB` | Maximum file size in bytes |
| `allowedFileTypes` | `string[]` | `["image/jpeg", "image/png"]` | Allowed MIME types |
| `containerClassName` | `string` | `""` | CSS class for container |
| `uploadBoxClassName` | `string` | `""` | CSS class for upload box |
| `imageClassName` | `string` | `""` | CSS class for preview images |
| `uploadIcon` | `React.ReactNode` | UploadCloudIcon | Custom upload icon |
| `deleteIcon` | `React.ReactNode` | TrashIcon | Custom delete icon |
| `uploadText` | `string` | "Choose files to upload" | Upload box text |
| `dragAndDropText` | `string` | "Drag and drop files here" | Drag and drop hint |
| `fileTypeText` | `string` | "PNG, JPG, or JPEG files" | Allowed file types hint |
| `onUpload` | `(files: File[]) => void` | - | Callback when files are uploaded |
| `onRemove` | `(file: File, index: number) => void` | - | Callback when file is removed |
| `onFileValidationError` | `(error: string) => void` | - | Callback for validation errors |

## 💡 Advanced Example

```tsx
import ImageUploader from 'ultra_image_uploader';

function ProductForm({ existingImages }: { existingImages: string[] }) {
  const [productImages, setProductImages] = useState<File[]>([]);

  return (
    <ImageUploader
      images={productImages}
      setImages={setProductImages}
      mode="update"
      defaultImages={existingImages}
      multiple={true}
      maxFileSize={10 * 1024 * 1024} // 10MB
      allowedFileTypes={["image/jpeg", "image/png", "image/webp"]}
      containerClassName="p-4 border rounded-lg"
      uploadBoxClassName="hover:bg-gray-50"
      imageClassName="rounded-md shadow-sm"
      uploadText="Upload product images"
      dragAndDropText="Drop images here"
      fileTypeText="JPEG, PNG, or WEBP files"
      onFileValidationError={(error) => alert(error)}
    />
  );
}
```

## 🎨 Styling

You can customize the component in several ways:

1. **CSS Classes**: Pass your own classes via `containerClassName`, `uploadBoxClassName`, and `imageClassName`
2. **Inline Styles**: Use `uploadBoxStyle` and `imageStyle` props
3. **Icons**: Replace the default icons with your own components
4. **Text**: Customize all displayed text

## 🤔 Why Use ProImageUploader?

<div align="center">

| Feature | Benefit |
|---------|----------|
| ✅ **Saves Development Time** | No need to build an upload component from scratch |
| ✅ **Consistent User Experience** | Professional look and feel out of the box |
| ✅ **Accessible** | Built with accessibility in mind |
| ✅ **TypeScript Support** | Fully typed for better developer experience |
| ✅ **Customizable** | Adapts to your design system |
| ✅ **Lightweight** | Only includes essential features |

</div>

## 📄 License

MIT © Digontha Das