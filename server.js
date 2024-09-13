

import connectToDatabase from "./database.js";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { fileURLToPath } from 'url';


// Enable CORS
app.use(cors());

// Connect to the database
connectToDatabase();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Serve PayPal client ID
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID || "default-client-id")
);

// Redirect root to products page
app.get("/", (req, res) => {
  // res.redirect("/products");
  res.send("the server is work good ");
});

// Handle missing routes and errors
app.use(notFound);
app.use(errorHandler);

// Set up static file serving for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/test", (req, res) => {
  res.send("My server is running!");
});



