import express from "express";
import mongoose from "mongoose";
import userRouter from './routes/users.js';
import blogRouter from './routes/blog.js'
import userProfileRouter from "./routes/userProfle.js"
import cors from "cors";
import dotenv from "dotenv";
import verifyJWT from "./middleware/verifyJWT.js";
import handleRefreshToken from "./controllers/refreshToken.js";
import { userLogin } from "./controllers/user.js";

dotenv.config();

const app = express();
const PORT = 4000;

// Allow requests from all origins, you can configure it according to your requirements
app.use(cors({
  origin: true,
  credentials: true,
}));
// Middleware to parse JSON bodies
app.use(express.json());
app.use("public", express.static('public'));

// Define routes
app.post("/login", userLogin);
app.get("/refresh", handleRefreshToken);
app.use("/user", userRouter);
app.use(verifyJWT); // Applying middleware globally

app.use("/blog", blogRouter);
app.use("/userProfile", userProfileRouter);


// Connect to MongoDB
mongoose
  .connect("mongodb+srv://arunmhere62:arunmhere62@cluster0.fof8dth.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDB connection error: ${error.message}`);
  });

// MongoDB event listeners
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
