import multer from 'multer';

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

export const errorSharp = (err, req, res, next) => {
  if (
    err.message &&
    err.message.includes(
      'Expected one of: heic, heif, avif, jpeg, jpg, jpe, tile, dz, png, raw, tiff, tif, webp, gif, jp2, jpx, j2k, j2c, jxl for format',
    )
  ) {
    return res.status(400).json({
      error: {
        message: 'mimetype inválido',
        status: 400,
      },
    });
  }

  next(err);
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
    console.log('acac');
    res.status(err.status || 500).json({
      error: {
        status: err.status,
        message: err.message,
      },
    });
  }
};
