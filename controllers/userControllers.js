const User = require("../models/userModel");
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');
const { transporter } = require("../utils/mailTransporter");
const { uploadImage, deleteImage } = require("../utils/cloudnary");
const saltRounds = 12;
const fs = require("fs")
const jwt = require("jsonwebtoken");
const { userEmailTemplate, adminEmailTemplate, forgetMailSendOtp, sendMailAfterfrogetPassword, ChangePasswordMail } = require("../utils/userAcountMailTemplate");


// old image delete
const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split('.')[0];
    return `${parts[parts.length - 2]}/${publicId}`;
};


const schema = new passwordValidator();
schema
    .is().min(5)
    .is().max(10)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces()
    .has().symbols(1);

const createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const errorMessage = [];
        if (!name) errorMessage.push("Name is required");
        if (!email) errorMessage.push("Email is required");
        if (!phone) errorMessage.push("Phone is required");
        if (!password) errorMessage.push("Password is required");
        if (!req.file) errorMessage.push("Image is must required is required")
        if (errorMessage.length > 0) {
            return res.status(400).json({
                success: false,
                message: errorMessage.join(", "),
            });
        }
        if (!schema.validate(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be 5-10 characters, include uppercase, lowercase, digit, symbol, no spaces.",
            });
        }
        const exitdata = await User.findOne({ $or: [{ email: email }, { phone: phone }] })
        if (exitdata) {
            return res.status(400).json({
                success: false,
                message: exitdata.email === email ? "Email is already registered ." : "Phone number is already registered ."
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadImage(req.file.path)
        }
        fs.unlinkSync(req.file.path)
        const data = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            image: imageUrl
        });
        await data.save();
        // Prepare user email template with a simple success message

        // Send email to user
        await transporter.sendMail({
            from: process.env.MAIL_SEND,
            to: email,
            subject: "Registration Successful!",
            html: userEmailTemplate(name),
        });

        // Send email to admin
        await transporter.sendMail({
            from: process.env.MAIL_SEND,
            to: process.env.MAIL_SEND,
            subject: "New User Registration",
            html: adminEmailTemplate(name, email, phone),
        });
        return res.status(200).json({
            success: true,
            message: "Registration successful",
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const data = await User.find()
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "User Found Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getGetSingleUser = async (req, res) => {
    try {
        const { id } = req.params
        const data = await User.findById(id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        res.status(200).json({
            success: true,
            message: "User Found Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, phone, address, city, state, pin } = req.body
        const errorMessage = []
        if (!name) errorMessage.push("Name is must Required")
        if (!email) errorMessage.push("Email is must Required")
        if (!phone) errorMessage.push("phone is must Required")
        if (errorMessage > 0) {
            return res.status(400).json({
                success: false,
                message: errorMessage.push(",")
            })
        }
        const data = await User.findById(id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Record Not Found"
            })
        }
        let imageUrl = data.image;
        if (req.file) {
            const oldimage = getPublicIdFromUrl(imageUrl)
            await deleteImage(oldimage);
            imageUrl = await uploadImage(req.file.path);
            fs.unlinkSync(req.file.path)
        }
        const updateUser = await User.findByIdAndUpdate(id, { name, email, phone, address, city, state, pin, image: imageUrl }, { new: true })
        return res.status(200).json({
            success: true,
            message: "User Profile Update Successfully",
            data: updateUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }
        const data = await User.findOne({ email });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }
        const checkPassword = await bcrypt.compare(password, data.password);
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }
        const key = data.role === "user" ? process.env.SALT_KEY_USER : process.env.SALT_KEY_ADMIN;

        // Define the payload with limited data
        const payload = { id: data._id, role: data.role, email: data.email };

        // Generate JWT
        jwt.sign(payload, key, { expiresIn: process.env.TOKEN_EXPIRE }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error generating token"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Login Successfully",
                data: data,
                token: token
            });
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const forgetPassword1 = async (req, res) => {
    try {
        const { email } = req.body
        const data = await User.findOne({ email: email })
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Email is not found"
            })
        }
        else {
            let otp = Math.floor(100000 + Math.random() * 900000);
            data.otp = otp
            await data.save()
            const mailOptions = {
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "Password Reset OTP - Zens",
                html: forgetMailSendOtp(data.name, data.otp)
            };
            await transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: "Email Address Is Not Found"
                    })
                }
                else {
                    res.status(200).json({
                        success: true,
                        message: "Otp Send successfully"
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const forgetPassword2 = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Otp is required"
            })
        }
        const data = await User.findOne({ email: email })
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        else {
            if (otp == data.otp) {
                return res.status(200).json({
                    success: true,
                    message: "Otp Verify Successfully"
                })
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP"
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const forgetPassword3 = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "password is required"
            })
        }
        const data = await User.findOne({ email: email })
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        else {
            if (!schema.validate(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be 5-10 characters, include uppercase, lowercase, digit, symbol, no spaces.",
                })
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            data.password = hashedPassword
            await data.save()

            // Send confirmation email
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Password Reset Successfully',
                html: sendMailAfterfrogetPassword(data.name)
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({
                success: true,
                message: "Password Reset Successfully"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


const changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const data = await User.findOne({ email: email });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }
        const comparePassword = await bcrypt.compare(currentPassword, data.password);
        if (!comparePassword) {
            return res.status(404).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        if (!schema.validate(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Password must be 5-10 characters, include uppercase, lowercase, digit, symbol, no spaces.",
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        data.password = hashedPassword;
        await data.save();

        // Send confirmation email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Changed Successfully',
            html: ChangePasswordMail(data.name)
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Password changed successfully and confirmation email sent."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createUser, getAllUser, getGetSingleUser, login, forgetPassword1, forgetPassword2, forgetPassword3, updateUser, changePassword
};
