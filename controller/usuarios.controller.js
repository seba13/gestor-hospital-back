import { FormData, File } from 'node-fetch';
import config from '../config/config.js';
// import FormData from 'form-data';
import multer from 'multer';
import sharp from 'sharp';
import { ErrorHandler } from '../errorHandler/errorHandler.js';

export default () => {
  const dominio = config.dominio;
  const port = config.portUsuarios;
  return {
    multerUploadImage: multer({
      fileFilter: (req, file, cb) => {
        const MIMETYPES = ['image/png', 'image/jpeg', 'image/webp'];

        if (!MIMETYPES.includes(file.mimetype)) {
          cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 1 * 1024 * 1024 * 10,
      },
    }).single('imagenPerfil'),

    actualizarImagen: (req, res, next) => {
      const { idUsuario } = req.params;

      sharp(req.file.buffer)
        .toBuffer()
        .then(data => {
          const formData = new FormData();
          // formDataImg.append('imagenPerfil', req.file.buffer);

          formData.append('imagenPerfil', new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype }));
          formData.append('idUsuario', JSON.stringify(idUsuario));

          fetch(`${dominio}:${port}/usuario/perfil/${idUsuario}/actualizar-imagen`, {
            method: 'PATCH',
            body: formData,
          })
            .then(result => result.json())
            .then(json => {
              if (json.error) {
                const newError = new ErrorHandler(json.error.message || 'error al enviar imagen');
                newError.setStatus(json.error.status || 500);

                throw newError;
              }

              res.status(200).json(json);
            })
            .catch(e => {
              next(e);
            });
        });
    },
  };
};
