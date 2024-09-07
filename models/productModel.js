const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productType: {
        type: String,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productBrand: {
        type: String,
        required: true
    },
    productItem: {
        type: String,
        required: true
    },
    productItemNumberOf: {
        type: String,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        // required: true
    },
    productDiscountPrice: {
        type: Number,
        // required: true
    },
    productFinalPrice: {
        type: Number,
        // required: true
    },
    productDetails: {
        type: String,
        required: true
    },
    productImage: {
        type: [String],
        required: true
    }
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product