const fs = require("fs")
const Category = require("../models/categoryModel");
const { uploadImage, deleteImage } = require("../utils/cloudnary");


// Helper function to extract publicId from the image URL
const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0];
    return `${parts[parts.length - 2]}/${publicId}`;
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category Name is required"
            });
        }
        const existingCategory = await Category.findOne({ name }).exec();
        if (existingCategory) {
            return res.status(401).json({
                success: false,
                message: "This category name already exists"
            });
        }
        const uploadResult = req.file ? await uploadImage(req.file.path) : null;
        const newCategory = new Category({
            name,
            image: uploadResult,
        });
        await newCategory.save();
        return res.status(200).json({
            success: true,
            message: "New Category created successfully"
        });
    } catch (error) {
        console.error('Error creating category:', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const getcategory = async (req, res) => {
    try {
        const data = await Category.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Category Not found "
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Category Found Successfully",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getSinglecategory = async (req, res) => {
    try {
        const data = await Category.findOne({ _id: req.params._id }).exec()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Category Not found "
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Category Found Successfully",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        const { name } = req.body;
        const category = await Category.findById(_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        let imageUrl = category.image;
        if (req.file) {
            if (category.image) {
                const oldImagePublicId = getPublicIdFromUrl(category.image);
                await deleteImage(oldImagePublicId);
            }
            imageUrl = await uploadImage(req.file.path);
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            _id,
            { name, image: imageUrl },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        const category = await Category.findById(_id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        if (category.image) {
            const oldImagePublicId = getPublicIdFromUrl(category.image);
            await deleteImage(oldImagePublicId);
        }

        await Category.findByIdAndDelete(_id);

        return res.status(200).json({ success: true, message: "Category and associated image deleted successfully" });
    } catch (error) {
        console.error('Error deleting category:', error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createCategory, getcategory, getSinglecategory, deleteCategory, updateCategory
};
