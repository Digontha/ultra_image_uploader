export interface ImageBBResponse {
    success: boolean;
    data: {
        url: string;
    };
}
export interface ImageBBUrlResult {
    urls: string[];
    apiKey: string;
}
export declare const uploadImagesToImageBB: (images: File[], apiKey: string) => Promise<ImageBBUrlResult>;
