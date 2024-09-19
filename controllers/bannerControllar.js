const Banner = require("../models/bannerModel");
const { uploadImage, deleteImage } = require("../utils/cloudnary");


// Helper function to extract publicId from the image URL
const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0];
    return `${parts[parts.length - 2]}/${publicId}`;
};



// Create a new banner
const createBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }
        const image = await uploadImage(req.file.path);
        if (!image) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed",
            });
        }
        const { name, active } = req.body;
        const newBanner = new Banner({ image, active, name });
        await newBanner.save();
        return res.status(200).json({
            success: true,
            message: "New Banner Created Successfully",
            data: newBanner,
        });
    } catch (error) {
        console.error("Error creating banner:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Get all banners
const getBanner = async (req, res) => {
    try {
        const banners = await Banner.find();
        if (!banners.length) {
            return res.status(404).json({
                success: false,
                message: "No banners found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Banners retrieved successfully",
            data: banners,
        });
    } catch (error) {
        console.error("Error fetching banners:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getSingleBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "No banner found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Banner retrieved successfully",
            data: banner,
        });
    } catch (error) {
        console.error("Error fetching banner:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        let updatedData = {};
        if (req.file) {
            if (banner.image) {
                const oldImagePublicId = getPublicIdFromUrl(banner.image);
                await deleteImage(oldImagePublicId);
            }
            const newImage = await uploadImage(req.file.path);
            if (!newImage) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                });
            }
            updatedData.image = newImage;
        }

        const { active } = req.body;
        if (active !== undefined) {
            updatedData.active = active;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: updatedBanner,
        });
    } catch (error) {
        console.error("Error updating banner:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }
        if (banner.image) {
            const imageUrl = banner.image;
            const publicId = getPublicIdFromUrl(imageUrl)
            await deleteImage(publicId);
        }
        await banner.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting banner:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


module.exports = {
    createBanner,
    getBanner,
    updateBanner,
    deleteBanner,
    getSingleBanner
};
