const multer = require("multer")

// Use memory storage instead of disk storage
const storage = multer.memoryStorage()

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false)
    }
}

const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter 
})

module.exports = upload