const notFoundMiddleware = (req, res, next) => {
  res.status(404).send('Route dose not exist');
}

export default notFoundMiddleware;