const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { registerUser, loginUser, getUserInfo } = require("../controller/authController")
const upload = require("../middleware/uploadMiddleware")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/getUser", protect, getUserInfo)

router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Something went wrong while uploading the image", error: error.message });
    }
});

module.exports = router