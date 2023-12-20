import multer from 'multer';
export class ErrorHandler extends Error {
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

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = '';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Archivo excede el tamaño permitido';
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'No debe exceder el numero máximo de archivos';
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Tipo de archivo no permitido';
    }

    res.status(400).json({
      error: message,
    });
  } else {
    next(err);
  }
};

export const errorHandler = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      error: err.message,
    });
  }
};
