export const errorMiddlewares = (error, req, res, next) => {
  if (error) {
    res.statusCode = 500;
    res.send({
      message:'server error'
    })
  }
  next()
}
