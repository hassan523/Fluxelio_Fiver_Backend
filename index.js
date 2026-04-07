import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import mongoose from "mongoose";

// Middlewares
import ErrorHandler from "./middlewares/ErrorHandler.js";
import ErrorLogger from "./middlewares/ErrorLogger.js";
import RateLimiter from "./middlewares/RateLimiter.js";
import SecurityHeaders from "./middlewares/HelmetMiddleware.js";

// DB Connection
import connectDB from "./config/DB.js";

// Routes
import AuthRoutes from "./routes/AuthRoutes.js";
import AgencyRoutes from "./routes/AgencyRoutes.js";
import OfficeRoutes from "./routes/OfficeRoutes.js";
import TagsRoutes from "./routes/TagsRoutes.js";
import InvitationRoutes from "./routes/InvitationRoutes.js";
import OperatorRoutes from "./routes/OperatorRoutes.js";
import ParcelRoutes from "./routes/ParcelRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import ContactRoutes from "./routes/ContactRoutes.js";
import SupportRoutes from "./routes/SupportRoutes.js";
import DashboardRoutes from "./routes/DashboardRoutes.js";
import { allowedOrigins } from "./utils/AllowedOrigins.js";

// Cloudinary
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();

app.use(SecurityHeaders);

// === MongoDB Connection ===
connectDB();

// === Global Middlewares ===
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(
   cors({
      origin: "*",
      credentials: true,
      methods: ["POST", "GET", "PATCH", "DELETE"],
   }),
);

// === Security Header Middleware ===
if (process.env.NODE_ENV !== "production") {
   app.use(
      "/uploads",
      (req, res, next) => {
         const origin = req.headers.origin;
         if (allowedOrigins.includes(origin)) {
            res.header("Access-Control-Allow-Origin", origin);
         }
         res.header("Access-Control-Allow-Methods", "GET");
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         next();
      },
      express.static("uploads"),
   );
} else {
   console.log("⚠️ Skipping /uploads static serve in production");
}

// === Rate Limiter
app.use(RateLimiter);

// === Logger Middleware for logging errors
app.use(ErrorLogger);

// === Cloudinary Configuration ===
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_Cloud,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   api_key: process.env.CLOUDINARY_API_KEY,
});

app.use(
   fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
   }),
);

app.get("/", (req, res) => {
   res.status(200).json({ message: "OK!" });
});

// // === Routes ===
app.use("/api", AuthRoutes);
app.use("/api", DashboardRoutes);
app.use("/api/agency", AgencyRoutes);
app.use("/api/office", OfficeRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/tags", TagsRoutes);
app.use("/api/invite", InvitationRoutes);
app.use("/api/parcel", ParcelRoutes);
app.use("/api/operator", OperatorRoutes);
app.use("/api/support", SupportRoutes);
app.use("/api", ContactRoutes);

// // === Error Handler
app.use(ErrorHandler);

// === Server Start ===
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
