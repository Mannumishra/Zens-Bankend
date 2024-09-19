const Product = require("../models/productModel");
const { uploadImage, deleteImage } = require("../utils/cloudnary");


const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0];
    return `${parts[parts.length - 2]}/${publicId}`;
};

const createProduct = async (req, res) => {
    try {
        const {
            productType,
            productCategory,
            productName,
            productBrand,
            productItem,
            productItemNumberOf,
            productQuantity,
            productPrice,
            productDiscountPercentage,
            productFinalPrice,
            productDetails
        } = req.body;

        const errorMessage = [];

        // Validation checks
        if (!productType) errorMessage.push("Product Type is required.");
        if (!productCategory) errorMessage.push("Product Category is required.");
        if (!productName) errorMessage.push("Product Name is required.");
        if (!productBrand) errorMessage.push("Product Brand is required.");
        if (!productItem) errorMessage.push("Product Item is required.");
        if (!productItemNumberOf) errorMessage.push("Product Item Number Of is required.");
        if (!productQuantity) errorMessage.push("Product Quantity is required.");
        if (productType === "Shop") {
            if (!productPrice) errorMessage.push("Product Price is required.");
            if (!productDiscountPercentage) errorMessage.push("Product Discount Price is required.");
            if (!productFinalPrice) errorMessage.push("Product Final Price is required.");
        }
        if (!productDetails) errorMessage.push("Product Details are required.");

        // If there are validation errors, return them
        if (errorMessage.length > 0) {
            return res.status(400).json({
                success: false,
                message: errorMessage.join(", ")
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            });
        }

        // Uploading images to Cloudinary
        const images = [];
        for (const file of req.files) {
            const imageUrl = await uploadImage(file.path);
            images.push(imageUrl);
        }

        const newProduct = new Product({
            productType,
            productCategory,
            productName,
            productBrand,
            productItem,
            productItemNumberOf,
            productQuantity,
            productPrice,
            productDiscountPercentage,
            productFinalPrice,
            productDetails,
            productImage: images
        });

        await newProduct.save();

        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.error('Error retrieving product:', error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        let updatedImages = existingProduct.productImage;
        if (req.files && req.files.length > 0) {
            for (const imageUrl of existingProduct.productImage) {
                const publicId = getPublicIdFromUrl(imageUrl)
                await deleteImage(publicId);
            }
            updatedImages = [];
            for (const file of req.files) {
                const imageUrl = await uploadImage(file.path);
                updatedImages.push(imageUrl);
            }
        }
        const updatedProductData = {
            ...req.body,
            productImage: updatedImages
        };
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        for (const imageUrl of product.productImage) {
            const publicId = getPublicIdFromUrl(imageUrl)
            await deleteImage(publicId);
        }
        await Product.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const getProductByProductName = async(req,res)=>{
    try {
        const {name} = req.params
        const data = await Product.findOne({productName :name})
        if(!data){
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Product Found",
            data:data
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

module.exports = {
    createProduct, getProducts, getProductById, updateProduct, deleteProduct ,getProductByProductName
}

