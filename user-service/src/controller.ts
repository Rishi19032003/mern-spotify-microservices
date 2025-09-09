import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import tryCatch from "./trycatch.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const registerUser = tryCatch(async(req, res) => {
    const { name, email, password } = req.body
    let user = await User.findOne({ email })
    
    if (user) {
        res.status(400).json({
            message: "User already exists"
        })

        return
    }

    const hashPassword = await bcrypt.hash(password, 10)

    user = await User.create({
        name,
        email,
        password: hashPassword
    })

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
        expiresIn: "7d"
    })

    res.status(201).json({
        message: "User registered",
        user,
        token
    })
})

export const loginUser = tryCatch(async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    
    if (!user) {
        res.status(404).json({
            message: "User does not exist"
        })

        return 
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        res.status(400).json({
            message: "Invalid password"
        })

        return 
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
        expiresIn: "7d"
    })

    res.status(200).json({
        message: "Logged in",
        user,
        token
    })
})

export const myProfile = tryCatch(async (req:AuthenticatedRequest, res) => {
    const user = req.user

    res.status(200).json(user)
})