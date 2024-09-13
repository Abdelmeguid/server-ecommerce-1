import express from "express";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { protectRoute, admin } from "../middleware/authMiddleware.js";

const productRoutes = express.Router();
//AMU below function discripe how i can find from the DB
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
};

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, userId, title } = req.body;

  const product = await Product.findById(req.params.id);

//BZH according below line we can find complete object of user contain all his data 
  const user = await User.findById(userId);

  //any (ramz by arabic) after the method .reduce or .find related always to ramz before method
  //in below function rev is related to product.reviews

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed.");
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      title,
      user: user._id,
    };

    product.reviews.push(review);

    product.numberOfReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review has been saved." });
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
});

//create a product
const createNewProduct = asyncHandler(async (req, res) => {
  //below come in the requst
  const {
    brand,
    name,
    category,
    stock,
    price,
    image,
    productIsNew,
    description,
  } = req.body;

  const newProduct = await Product.create({
    brand,
    name,
    category,
    stock,
    price,
    image: "/images/" + image,
    productIsNew,
    description,
  });
  await newProduct.save();

  const products = await Product.find({});

  if (newProduct) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error("Product could not be uploaded.");
  }
});
// delete a product
// i comment below deleteProduct function from the source code of udemy and add new code from CGPT and to run the function
//because it not compelet in source from udemy
// const deleteProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findByIdAndDelete(req.params.id);

//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });

// (FROM CGPT)The product is retrieved using findById() method to ensure its existence in the database.

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // (FROM CGPT) To remove a product from MongoDB using Mongoose, you can use the deleteOne() or findOneAndDelete() methods.
    // Here's an example of how you can modify the deleteProduct function to properly remove the product from the database:
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//update a product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    brand,
    name,
    image,
    category,
    stock,
    price,
    id,
    productIsNew,
    description,
  } = req.body;

  const product = await Product.findById(id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.brand = brand;
    product.image = "/images/" + image;
    product.category = category;
    product.stock = stock;
    product.productIsNew = productIsNew;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
});

const removeProductReview = asyncHandler(async (req, res) => {
  //CGPT in below line req.params.productId extract productId from URL that conatain productId & reviewId in params
  //as below in the end of this sheet in route that related to removeProductReview
  const product = await Product.findById(req.params.productId);

  //below filter is used in remove operation of any thing
  //BZH filter function run on all elements and return new array only true the condition in the function in the filter method .
  //filter function use to delete something that can not give true to it is condition.
  const updatedReviews = product.reviews.filter(
    //we can remove .valueOf() according CGPT
    (rev) => rev._id.valueOf() !== req.params.reviewId
  );

  if (product) {
    product.reviews = updatedReviews;

    product.numberOfReviews = product.reviews.length;

    if (product.numberOfReviews > 0) {
      //item represents each review object in the product.reviews array  CGPT
      //item.rating retrieves the rating value from each review object  CGPT.
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      //according my understanding and CGPT schould modify in below line to product.rating = 0
      product.rating = 1;
    }

    await product.save();
    res.status(201).json({ message: "Review hass been removed." });
  } else {
    res.status(404);
    throw new Error("Product not found.");
  }
});

productRoutes.route("/").get(getProducts);
productRoutes.route("/:id").get(getProduct);
productRoutes.route("/reviews/:id").post(protectRoute, createProductReview);
productRoutes.route("/").put(protectRoute, admin, updateProduct);
productRoutes.route("/:id").delete(protectRoute, admin, deleteProduct);
productRoutes.route("/").post(protectRoute, admin, createNewProduct);
productRoutes
  .route("/:productId/:reviewId")
  .put(protectRoute, admin, removeProductReview);

export default productRoutes;

//below code from CGPT to fetch and populate date when order schema have a user schema refrence 

// // Assuming you have the order document fetched from the database
// const order = await Order.findById(orderId)
//   .populate('user') // This will populate the 'user' field with the user document
//   .execPopulate();

// // Now you can access the username and email of the user like this:
// const username = order.username; // This will be the user's username
// const email = order.email; // This will be the user's email

