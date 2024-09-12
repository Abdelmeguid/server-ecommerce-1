import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
// AMU this file is important to secur any route in your application 
//to be sure that it is the real user that have all rights to access this data

const protectRoute = asyncHandler(async (req, res, next) => {
  let token;
// CGPT below line to be sure that the requst have token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // CGPT below two mline to extract the token
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      req.user = User.findById(decoded.id);

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token.');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin !== 'false') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin.');
  }
};

export { protectRoute, admin };
