const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,  // Default is active, meaning it will be shown
    },
})

const Banner = mongoose.model("Banner" ,bannerSchema)

module.exports = Banner