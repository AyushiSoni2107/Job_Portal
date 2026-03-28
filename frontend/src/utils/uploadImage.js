import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';
import { resolveMediaUrl } from './mediaUrl';

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append image file to form data
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set header for file upload
            },
        });

        const imageUrl = resolveMediaUrl(response?.data?.imageUrl || response?.data?.url || '');
        return { ...response.data, imageUrl };
    } catch (error) {
        console.error('Error uploading the image:', error);
        throw error; // Rethrow error for handling
    }
};

export default uploadImage;
