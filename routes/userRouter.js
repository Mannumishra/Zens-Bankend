const { createUser, getAllUser, login, getGetSingleUser, forgetPassword1, forgetPassword2, forgetPassword3, updateUser, changePassword } = require("../controllers/userControllers")
const upload = require("../middleware/multer")

const userRouter = require("express").Router()

userRouter.post("/user", upload.single("image"), createUser)
userRouter.put("/user/:id", upload.single("image"), updateUser)
userRouter.get("/user", getAllUser)
userRouter.get("/user/:id", getGetSingleUser)
userRouter.post("/user/login", login)
userRouter.post("/forget-password/send-otp", forgetPassword1)
userRouter.post("/forget-password/verify-otp", forgetPassword2)
userRouter.post("/forget-password/reset-password", forgetPassword3)
userRouter.post("/user/chnage-password", changePassword)

module.exports = userRouter