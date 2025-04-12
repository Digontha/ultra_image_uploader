export interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
  mode: "add" | "update";
  defaultImages?: string[];
  multiple?: boolean;
  maxFileSize?: number; 
  allowedFileTypes?: string[]; 
  containerClassName?: string;
  uploadBoxClassName?: string;
  imageClassName?: string;
  uploadBoxStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  uploadIcon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  uploadText?: string;
  dragAndDropText?: string;
  fileTypeText?: string;
  onUpload?: (files: File[]) => void;
  onRemove?: (file: File, index: number) => void;
  onFileValidationError?: (error: string) => void;
}

export interface ImageBBUrl{
  images: File[];
  apiKey:string;
}
