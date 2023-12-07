export class ErrorHandler extends Error {
  
  setStatus(status) {
    this.status = status;
  }
}

export const errorHandler = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      error: err.message,
    });
  }
};
