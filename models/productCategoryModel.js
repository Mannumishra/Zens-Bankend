const mongoose = require("mongoose")

const productCategorySchema = new mongoose.Schema({
    productCategoryname: {
        type: String,
        required: true,
        enum: ['Shop', 'Products']
    }
})

const productCategory = mongoose.model("Product-Category", productCategorySchema)

module.exports = productCategory