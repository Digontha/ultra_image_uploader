const uploadImageToImageBB = async (imageFile, apiKey) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.success) {
            return data.data.url;
        }
        else {
            throw new Error("Image upload failed");
        }
    }
    catch (error) {
        console.error("Error uploading image:", error);
        alert("❌ Failed to upload image. Please try again.");
        return null;
    }
};
export const imageUrl = async (images, apiKey) => {
    const imageURLs = (await Promise.all(images.map((image) => uploadImageToImageBB(image, apiKey))))
        .filter((url) => url !== null);
    if (imageURLs.length === 0) {
        alert("Failed to upload images.");
        return [];
    }
    return imageURLs;
};
