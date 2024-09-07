const multer = require('multer');
const fs = require("fs")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "./uploads"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
        const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedFormats.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file format'), false);
        }
    }
});

module.exports = upload;
