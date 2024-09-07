const express = require("express");
const { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory } = require("../controllers/productCategoryControllers");
const productCategoryRouter = express.Router();

// Define the routes
productCategoryRouter.post("/product-category", createProductCategory);
productCategoryRouter.get("/product-category", getAllProductCategories);
productCategoryRouter.get("/product-category/:_id", getProductCategoryById);
productCategoryRouter.put("/product-category/:_id", updateProductCategory);
productCategoryRouter.delete("/product-category/:_id", deleteProductCategory);

module.exports = productCategoryRouter;
