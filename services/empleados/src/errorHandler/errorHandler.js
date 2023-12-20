class ErrorHandler extends Error {
  setStatus(status) {
    this.status = status;
  }

  setDetailsError(message) {
    this.details = message;
  }

  setInternalMessage(message) {
    this.internalMessage = message;
  }
}
export default ErrorHandler;



export const errorMessage = (err, req, res, next) => {
  if (err.message) {
    next(err);
  } else {
    next(new Error('error al procesar solicitud'));
  }
};

export const errorHandler = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      error: {
        status: err.status,
        message: err.message,
      },
    });
  }
};
