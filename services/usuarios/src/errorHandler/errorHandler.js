import multer from 'multer';

export const errorMessage = (err, req, res, next) => {
  if (err.message) {
    next(err);
  } else {
    next(new Error('error al procesar solicitud'));
  }
};

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
      error: {
        status: 400,
        message,
      },
    });
  } else {
    next(err);
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
