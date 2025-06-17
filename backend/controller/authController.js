const User = require("../models/User")
const jwt = require("jsonwebtoken")

//Generte json web token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

//Register user
exports.registerUser = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
    }

    const { fullName, email, password, profileImageUrl } = req.body;

    //validation: check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields required" })
    }

    try {
        //check if email already exist
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        //create user
        const user = await User.create({
            fullName,
            password,
            email,
            profileImageUrl,
        })

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })

    } catch (err) {
        res.status(500)
            .json({ message: "Error registering user", error: err.message })
    }
}

//login user
exports.loginUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields required" })
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "invalid credential" })
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (err) {
        res.status(500)
            .json({ message: "Error login user", error: err.message })
    }
}

//user info
exports.getUserInfo = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500)
            .json({ message: "Error getting user", error: err.message })
    }
}