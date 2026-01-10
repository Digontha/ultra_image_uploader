export interface ImageBBResponse {
    success: boolean;
    data: {
        url: string;
    };
}
export interface ImageBBUrlResult {
    urls: string[];
}
export declare const uploadImagesToImageBB: (images: File[], apiKey: string) => Promise<ImageBBUrlResult>;
//# sourceMappingURL=imageUpload.d.ts.map