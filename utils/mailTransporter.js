const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
        user: process.env.MAIL_SEND,
        pass: process.env.MAIL_PASS
    }
})

module.exports = {
    transporter
}