/**
 * Base provider class for image uploads
 */
import { validateFileComplete } from '../utils/validation';
export class BaseImageProvider {
    async validate(file, validationOptions) {
        return validateFileComplete(file, validationOptions);
    }
    createUploadError(code, message, details) {
        const error = new Error(message);
        error.code = code;
        error.provider = this.name;
        error.details = details;
        return error;
    }
    async readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
    createFormData(file, additionalData) {
        const formData = new FormData();
        formData.append('image', file);
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }
        return formData;
    }
    trackProgress(xhr, onProgress) {
        if (!onProgress)
            return;
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                onProgress({
                    loaded: event.loaded,
                    total: event.total,
                    percentage: Math.round((event.loaded / event.total) * 100),
                });
            }
        });
    }
}
//# sourceMappingURL=BaseProvider.js.map