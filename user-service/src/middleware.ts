import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { User } from "./model.js"

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.token as string

        if (!token) {
            res.status(403).json({
                message: "Please login"
            })

            return
        }

        const decodedvalue = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload

        if (!decodedvalue || !decodedvalue._id) {
            res.status(403).json({
                message: "Invalid token"
            })

            return
        }

        const userId = decodedvalue._id

        const user = await User.findById(userId).select("-password")

        if (!user) {
            res.status(403).json({
                message: "User not found"
            })

            return
        }
    } catch (error) {
        res.status(403).json({
            message: 'Please login'
        })
    }
}