# Ultra Image Uploader - Best Usage Guide

This guide shows you the best ways to use the Ultra Image Uploader package in real-world scenarios.

## Table of Contents

1. [Quick Setup](#quick-setup)
2. [Common Use Cases](#common-use-cases)
3. [Best Practices](#best-practices)
4. [Production Tips](#production-tips)
5. [Examples](#examples)

---

## Quick Setup

### 1. Install the Package

```bash
npm install ultra-image-uploader
```

### 2. Basic Setup

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function MyComponent() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <div>
      <ImageUploader
        images={images}
        setImages={setImages}
      />
    </div>
  );
}
```

---

## Common Use Cases

### Use Case 1: User Profile Picture Upload

Perfect for avatar/profile picture uploads with single image mode.

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function ProfilePictureUpload() {
  const [avatar, setAvatar] = useState<File[]>([]);

  const handleUploadComplete = async (urls: string[]) => {
    // Send to your backend
    await fetch('/api/user/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatarUrl: urls[0] }),
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Profile Picture</h2>

      <ImageUploader
        images={avatar}
        setImages={setAvatar}
        multiple={false}
        maxImages={1}
        maxSize={5 * 1024 * 1024} // 5MB
        theme="modern"
        showThemeSelector={false}
        showImageCount={false}
        uploadConfig={{
          provider: 'imgbb',
          config: { apiKey: process.env.NEXT_PUBLIC_IMGBB_API_KEY! }
        }}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
```

### Use Case 2: Product Gallery for E-commerce

Upload multiple product images with drag-and-drop reordering.

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function ProductImageGallery() {
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([
    'https://example.com/product1.jpg',
    'https://example.com/product2.jpg',
  ]);

  const handleUploadComplete = async (urls: string[]) => {
    // Save to database
    await fetch('/api/products/images', {
      method: 'POST',
      body: JSON.stringify({ images: urls }),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Product Images</h3>

      <ImageUploader
        images={productImages}
        setImages={setProductImages}
        mode="update"
        defaultImages={existingImages}
        multiple={true}
        maxImages={10}
        maxSize={10 * 1024 * 1024} // 10MB
        theme="fresh"
        containerClassName="max-w-4xl mx-auto"
        uploadConfig={{
          provider: 'cloudinary',
          config: {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
          }
        }}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
```

### Use Case 3: Blog Post Featured Image

Simple single image upload for blog posts.

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function BlogFeaturedImage() {
  const [featuredImage, setFeaturedImage] = useState<File[]>([]);

  return (
    <div className="my-6">
      <label className="block text-sm font-medium mb-2">
        Featured Image
      </label>

      <ImageUploader
        images={featuredImage}
        setImages={setFeaturedImage}
        multiple={false}
        maxImages={1}
        theme="nature"
        showThemeSelector={false}
        showImageCount={false}
        containerClassName="max-w-2xl mx-auto mt-0"
      />
    </div>
  );
}
```

### Use Case 4: Real Estate Property Gallery

Upload multiple property photos with auto-upload.

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function PropertyGallery() {
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Property Photos</h2>

      <ImageUploader
        images={propertyImages}
        setImages={setPropertyImages}
        multiple={true}
        maxImages={30}
        maxSize={20 * 1024 * 1024} // 20MB
        theme="ocean"
        autoUpload={true}
        uploadConfig={{
          provider: 'cloudinary',
          config: {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
            uploadPreset: 'property_images'
          }
        }}
        onUploadComplete={(urls) => {
          setUploadedUrls(urls);
          // Automatically save to database
          savePropertyImages(urls);
        }}
        onUploadError={(error) => {
          console.error('Upload failed:', error);
          alert('Failed to upload images. Please try again.');
        }}
      />

      {uploadedUrls.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700">
            ✓ {uploadedUrls.length} image(s) uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}

function savePropertyImages(urls: string[]) {
  // Your save logic
}
```

### Use Case 5: Custom Brand Theme

Match the uploader to your brand colors.

```tsx
import { ImageUploader, themes } from "ultra-image-uploader";
import { useState } from "react";

function BrandedUploader() {
  const [images, setImages] = useState<File[]>([]);

  // Define your brand theme
  const brandTheme = {
    name: 'MyBrand',
    colors: {
      primary: '#FF6B35',      // Your brand orange
      primaryHover: '#E55A2B',
      background: 'linear-gradient(135deg, #FF6B35 0%, #F7C59F 100%)',
      border: '#FFE5D9',
      text: '#2D3142',
      textSecondary: '#4F5D75',
      cardBg: '#FFFFFF',
      cardBorder: '#FFE5D9',
      shadow: '0 10px 40px rgba(255, 107, 53, 0.2)',
    },
  };

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      customTheme={brandTheme}
      showThemeSelector={false}
      theme="modern" // Fallback
    />
  );
}
```

### Use Case 6: Custom Upload Button

Use your own styled button to trigger file selection:

```tsx
import { ImageUploader } from "ultra-image-uploader";
import { useState } from "react";

function CustomButtonUploader() {
  const [images, setImages] = useState<File[]>([]);

  const myCustomButton = (
    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="font-semibold">Select Photos</span>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Photo Gallery</h2>

      <ImageUploader
        images={images}
        setImages={setImages}
        customUploadButton={myCustomButton}
        hideDefaultUploadArea={true}
        multiple={true}
        maxImages={10}
        onUploadClick={() => {
          console.log('Custom button clicked!');
          // Add any custom logic here
        }}
      />
    </div>
  );
}
```

### Use Case 7: Hybrid Approach

Provide both a quick-upload button AND keep the drag-and-drop area:

```tsx
function HybridUploader() {
  const [images, setImages] = useState<File[]>([]);

  const quickUploadBtn = (
    <button className="w-full px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
      Quick Add Photos
    </button>
  );

  return (
    <div>
      {/* Custom button shown above */}
      <ImageUploader
        images={images}
        setImages={setImages}
        customUploadButton={quickUploadBtn}
        // Don't set hideDefaultUploadArea - both will be shown
        multiple={true}
        theme="ocean"
      />
    </div>
  );
}
```

---

## Best Practices

### 1. Environment Variables

Always store API keys in environment variables:

```env
# .env.local
NEXT_PUBLIC_IMGBB_API_KEY=your_api_key_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 2. Error Handling

Handle upload errors gracefully:

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  uploadConfig={uploadConfig}
  onUploadError={(error) => {
    console.error('Upload error:', error);

    // Show user-friendly error message
    if (error.message.includes('network')) {
      alert('Network error. Please check your connection.');
    } else if (error.message.includes('size')) {
      alert('File too large. Please upload a smaller file.');
    } else {
      alert('Upload failed. Please try again.');
    }
  }}
/>
```

### 3. Loading States

Show loading indicators during uploads:

```tsx
import { useState } from "react";
import { ImageUploader } from "ultra-image-uploader";

function UploadWithLoading() {
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div>
      {isUploading && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center gap-2">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          <span className="text-blue-700">Uploading images...</span>
        </div>
      )}

      <ImageUploader
        images={images}
        setImages={setImages}
        uploadConfig={uploadConfig}
        onUploadComplete={() => setIsUploading(false)}
        onUploadError={() => setIsUploading(false)}
      />
    </div>
  );
}
```

### 4. File Validation

Validate files before and after upload:

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  maxSize={5 * 1024 * 1024}        // 5MB max
  maxImages={10}                    // Max 10 images
  allowedTypes={[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]}
/>
```

### 5. Responsive Layouts

Use responsive containers:

```tsx
// Mobile-first approach
<div className="px-4">
  <ImageUploader
    images={images}
    setImages={setImages}
    containerClassName="max-w-full md:max-w-2xl lg:max-w-4xl mx-auto"
    theme="sunset"
  />
</div>
```

### 6. Theme Selection Based on Context

Match theme to your app context:

```tsx
function ContextualUploader({ context }: { context: 'light' | 'dark' | 'colored' }) {
  const [images, setImages] = useState<File[]>([]);

  const themeMap = {
    light: 'fresh',
    dark: 'modern',
    colored: 'sunset'
  };

  return (
    <ImageUploader
      images={images}
      setImages={setImages}
      theme={themeMap[context]}
      showThemeSelector={false}
    />
  );
}
```

---

## Production Tips

### 1. Add Image Optimization

Optimize images before upload:

```tsx
import { ImageUploader } from "ultra-image-uploader";

async function optimizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize if too large
      const maxWidth = 1920;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) resolve(new File([blob], file.name, { type: file.type }));
        else resolve(file);
      }, file.type, 0.85);
    };
    img.src = URL.createObjectURL(file);
  });
}
```

### 2. Upload Progress Tracking

Show detailed progress:

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  autoUpload={true}
  uploadConfig={{
    provider: 'imgbb',
    config: { apiKey: process.env.IMGBB_API_KEY! }
  }}
/>
```

### 3. Retry Failed Uploads

Implement retry logic:

```tsx
function UploadWithRetry() {
  const [images, setImages] = useState<File[]>([]);
  const [failedImages, setFailedImages] = useState<File[]>([]);

  const handleUploadError = (error: Error) => {
    console.error('Upload failed:', error);
    // Show retry button
  };

  const retryUpload = () => {
    setImages([...images, ...failedImages]);
    setFailedImages([]);
  };

  return (
    <div>
      <ImageUploader
        images={images}
        setImages={setImages}
        onUploadError={handleUploadError}
      />

      {failedImages.length > 0 && (
        <button
          onClick={retryUpload}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Retry Failed Uploads
        </button>
      )}
    </div>
  );
}
```

### 4. Cloudinary Transformations

Use Cloudinary transformations:

```tsx
<ImageUploader
  images={images}
  setImages={setImages}
  uploadConfig={{
    provider: 'cloudinary',
    config: {
      cloudName: 'your-cloud',
      uploadPreset: 'your-preset',
      // Add transformations
      folder: 'product-images',
      tags: ['ecommerce', 'products'],
    }
  }}
/>
```

---

## Examples

### Complete Example: Multi-Step Form

```tsx
import { useState } from "react";
import { ImageUploader } from "ultra-image-uploader";

function ProductForm() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleSubmit = async () => {
    // Upload images first
    const urls = await uploadImages(images, 'imgbb', {
      apiKey: process.env.IMGBB_API_KEY!
    });

    // Submit form with image URLs
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        images: urls.map(u => u.url)
      })
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Product Information</h2>
          {/* Form fields */}
          <button onClick={() => setStep(2)}>Next: Upload Images</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upload Images</h2>

          <ImageUploader
            images={images}
            setImages={setImages}
            multiple={true}
            maxImages={8}
            theme="modern"
            containerClassName="max-w-full mx-auto mt-0"
          />

          <div className="mt-6 flex gap-4">
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={handleSubmit}>Submit Product</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Example: Dark Mode Support

```tsx
import { useState, useEffect } from "react";
import { ImageUploader } from "ultra-image-uploader";

function DarkModeUploader() {
  const [isDark, setIsDark] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  return (
    <div className={isDark ? 'dark' : ''}>
      <ImageUploader
        images={images}
        setImages={setImages}
        theme={isDark ? 'modern' : 'fresh'}
        showThemeSelector={false}
      />

      <button
        onClick={() => setIsDark(!isDark)}
        className="mt-4 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        Toggle {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

---

## Quick Reference

### All Built-in Themes

```tsx
<ImageUploader theme="modern" />  // Purple gradient
<ImageUploader theme="fresh" />   // Mint/Rose gradient
<ImageUploader theme="nature" />  // Green gradient
<ImageUploader theme="ocean" />   // Blue gradient
<ImageUploader theme="sunset" />  // Orange gradient
```

### Common Props

```tsx
<ImageUploader
  images={images}           // Required
  setImages={setImages}     // Required
  multiple={true}           // Allow multiple files
  maxImages={20}            // Max number of images
  maxSize={50 * 1024 * 1024} // Max file size (50MB)
  theme="modern"            // Built-in theme
  showThemeSelector={true}  // Show theme buttons
  showImageCount={true}     // Show image counter
  autoUpload={false}        // Upload automatically
/>
```

### Upload Providers

```tsx
// ImgBB
uploadConfig={{
  provider: 'imgbb',
  config: { apiKey: 'your-key' }
}}

// Cloudinary
uploadConfig={{
  provider: 'cloudinary',
  config: {
    cloudName: 'your-cloud',
    uploadPreset: 'your-preset'
  }
}}
```

---

## Need Help?

- [GitHub Issues](https://github.com/digontha/ultra-image-uploader/issues)
- [NPM Package](https://www.npmjs.com/package/ultra-image-uploader)
- [Documentation](https://github.com/digontha/ultra-image-uploader#readme)
