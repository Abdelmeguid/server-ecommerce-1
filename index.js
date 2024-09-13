
// import dotenv from "dotenv";
// dotenv.config();
// import connectToDatabase from "./database.js";
// import express from "express";
// const app = express();
// import path from "path";
// import productRoutes from "./routes/productRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// //i add the below line to use authMiddleware.js that the instructor did not use it
// import { notFound, errorHandler } from "./middleware/authMiddleware.js";

// const cors = require("cors");
// app.use(cors()); // Enable CORS
// //Our Routes

// connectToDatabase();


// app.use(express.json());

// ////@@@

// //i add the below two line to use authMiddleware.js that the instructor did not use it
// app.use(notFound);
// app.use(errorHandler);

// ///@@@@@
// //test that server is running 
// app.get("/", (req, res) => {
//   res.send("Welcome, ya POP");
// });

// //CGPT this discuss below three lines ....app.use([path], middlewareFunction);
// app.use("/api/products", productRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);

// app.get("/api/config/paypal", (req, res) =>
//   res.send(process.env.PAYPAL_CLIENT_ID)
// );
// //i add below 3 lines BZH
// //CGPT below function app.get have 2 Argument first path (defined on the start of this file ).2nd argument is callback function 
// //AMU we can use app.post or app.put or app.patch with (http requsts) that is comed from the client according the kind of http requst 
// //from the fetch method 
// app.get("/", (req, res) => {
//   // res.send("Hello, Express!");
//   res.redirect("/products");
// });

// const port = process.env.PORT || 5000;

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////BZH all below not understanding completly till now                                                                                  
// //CGPT const __dirname = path.resolve();: This line declares a constant variable __dirname and sets it to the resolved directory name. 
// const __dirname = path.resolve();
// //CGPT static files like photos in url /uploads ...
// // &it can be accessed on the client-side using the URL "/uploads/image.jpg".
// //&path.join() function is used to join the __dirname and "/uploads" to form the absolute path to the folder containing the static files.
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   );
// }
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// app.listen(port, () => {
//   console.log(`Server runs on poooooort ${port}.`);
// });



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

app.get("server-express-ecommerce-1.vercel.app", (req, res) => {
  // res.redirect("/products");
  res.send("the server is work good ");
});

