// CGPT The notFound middleware is used to handle routes that do not match any of the existing routes in the application.
const notFound = (req, res, next) => {
  //CGPT The Error object is created with a custom error message that includes the original URL from the request (req.originalUrl). 
  //This makes it easier to identify the resource that couldn't be found in the error message.
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
  }
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
      message: err.message,
      //CGPT In development mode (process.env.NODE_ENV !== 'production'), the stack property includes the error stack trace, providing more detailed information about the error. 
      //In production mode, the stack trace is omitted to prevent leaking sensitive information to clients.
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
  }
  
  export { notFound, errorHandler }