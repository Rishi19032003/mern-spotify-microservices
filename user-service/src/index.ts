import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRoutes from "./route.js"

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "Spotify"
        })
        console.log("MONGODB CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.log("Error in the connectDB function", error)
    }
}

const app = express()

app.use(express.json())

app.use("/api/v1", userRoutes)

app.get("/", (req, res) => {
    res.send("Server is working!")
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`)
    connectDB()
})