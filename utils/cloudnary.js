const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadImage = async (file) => {
    try {
        const options = {
            folder: 'Zens_Media',
        };
        const result = await cloudinary.uploader.upload(file, options);
        return result.secure_url;
    } catch (error) {
        console.error('Image upload failed:', error.message);
        throw new Error('Image upload failed');
    }
};

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            console.error('Failed to delete image:', result);
            throw new Error('Image deletion failed');
        }
        console.log('Image deleted successfully');
    } catch (error) {
        console.error('Image deletion failed:', error.message);
        throw new Error('Image deletion failed');
    }
};
module.exports = {
    uploadImage,
    deleteImage
};