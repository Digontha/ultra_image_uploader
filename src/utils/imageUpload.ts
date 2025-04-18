export interface ImageBBResponse {
    success: boolean;
    data: {
      url: string;
    };

  }
  export interface ImageBBUrlResult {
    urls: string[];
  }
  const uploadImageToImageBB = async (
    imageFile: File, 
    apiKey: string
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", imageFile);
    
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data: ImageBBResponse = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("❌ Failed to upload image. Please try again.");
      return null;
    }
  };
  
  export const uploadImagesToImageBB = async (
    images: File[],
    apiKey: string
  ): Promise<ImageBBUrlResult> => {
    const imageURLs = (
      await Promise.all(images.map((image) => uploadImageToImageBB(image, apiKey)))
    ).filter((url): url is string => url !== null);
    
    if (imageURLs.length === 0) {
      throw new Error("Failed to upload images");
    }
    
    return {
      urls: imageURLs,
    };
  };