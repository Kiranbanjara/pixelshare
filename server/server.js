import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import session from "express-session"
import RedisStore from "connect-redis"
import fs from "fs"
import path from "path"

import redisClient from "./config/redis.js"

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import mediaRoutes from "./routes/media.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

const uploadsDir = path.join(process.cwd(), "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  }),
)

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/media", mediaRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
