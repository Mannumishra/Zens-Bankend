const productCategory = require("../models/productCategoryModel"); // Adjust the path as necessary

// Create a new product category
exports.createProductCategory = async (req, res) => {
    try {
        console.log(req.body)
        console.log("i am hit ")
        const { productCategoryname } = req.body;

        // Check if the product category already exists
        const existingCategory = await productCategory.findOne({ productCategoryname });
        if (existingCategory) {
            return res.status(409).json({ message: "Product category already exists" });
        }

        const newCategory = new productCategory({ productCategoryname });
        await newCategory.save();

        return res.status(200).json({ message: "Product category created successfully", newCategory });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validOptions = productCategory.schema.path('productCategoryname').enumValues;
            const validationErrors = Object.values(error.errors).map(err => err.message);
            const errorMessage = validationErrors.join(', ') + `. Valid options are: ${validOptions.join(', ')}`;
            res.status(400).json({ message: errorMessage });
        } else {
            res.status(500).json({ message: "Server Error" });
        }
    }
};

// Get all product categories
exports.getAllProductCategories = async (req, res) => {
    try {
        const categories = await productCategory.find();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single product category by ID
exports.getProductCategoryById = async (req, res) => {
    try {
        const { _id } = req.params;
        const category = await productCategory.findById(_id);

        if (!category) {
            return res.status(404).json({ message: "Product category not found" });
        }

        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a product category by ID
exports.updateProductCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        const { productCategoryname } = req.body;

        const updatedCategory = await productCategory.findByIdAndUpdate(
            _id,
            { productCategoryname },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Product category not found" });
        }

        return res.status(200).json({ message: "Product category updated successfully", updatedCategory });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a product category by ID
exports.deleteProductCategory = async (req, res) => {
    try {
        const { _id } = req.params;
        const deletedCategory = await productCategory.findByIdAndDelete(_id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Product category not found" });
        }

        return res.status(200).json({ message: "Product category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
