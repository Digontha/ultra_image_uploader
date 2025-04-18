export interface ImageUploaderProps {
    images: File[];
    setImages: (images: File[]) => void;
    mode: "add" | "update";
    defaultImages?: string[];
    multiple?: boolean;
    inputStyles?: string;
    containerStyles?: string;
    uploadText?: string;
    typeText?: string;
}
export declare function ImageUploader({ images, setImages, mode, defaultImages, multiple, inputStyles, containerStyles, uploadText, typeText, }: ImageUploaderProps): import("react/jsx-runtime").JSX.Element;
