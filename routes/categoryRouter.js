const { createCategory, getcategory, getSinglecategory, deleteCategory, updateCategory } = require("../controllers/categoryControllers")
const upload = require("../middleware/multer")

const categoryRouter = require("express").Router()

categoryRouter.post("/category", upload.single("image"), createCategory)
categoryRouter.get("/category", getcategory)
categoryRouter.get("/category/:_id", getSinglecategory)
categoryRouter.delete("/category/:_id", deleteCategory); 
categoryRouter.put("/category/:_id", upload.single("image"), updateCategory); 

module.exports = categoryRouter;