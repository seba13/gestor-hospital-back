import { FormData, File } from 'node-fetch';
import config from '../config/config.js';
// import FormData from 'form-data';
import multer from 'multer';
import sharp from 'sharp';
import ErrorHandler from '../errorHandler/errorHandler.js';

export default () => {
  const { urlUsuarios } = config;

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

    actualizarImagenUsuario: (req, res, next) => {
      const { idUsuario } = req.params;

      const config = {
        jpeg: { quality: 20, effort: 2 },
        webp: { quality: 20, effort: 2 },
        png: { quality: 20, effort: 2, compressionLevel: 2 },
      };

      const ext = req.file.mimetype.split('/')[1];

      if (!config[ext]) {
        const newError = new ErrorHandler('extension inválida');
        newError.setStatus(500);
        throw newError;
      } else {
        console.log('continuar');
      }

      try {
        // const buffer = Buffer.from(req.file.buffer);

        sharp(req.file.buffer)
          .resize({ width: 400, height: 400, fit: 'cover', position: 'top' })
          [ext]([config][ext])
          .toBuffer()
          .then(data => {
            const formData = new FormData();
            // formDataImg.append('imagenPerfil', req.file.buffer);

            formData.append('imagenPerfil', new File([data], req.file.originalname, { type: req.file.mimetype }));
            formData.append('idUsuario', JSON.stringify(idUsuario));

            fetch(`${urlUsuarios}/usuario/perfil/${idUsuario}/actualizar-imagen`, {
              method: 'PATCH',
              body: formData,
            })
              .then(response => response.json())
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
      } catch (e) {
        const newError = new ErrorHandler('error al enviar imagen');
        newError.setStatus(500);

        next(newError);
      }
    },

    obtenerImagenUsuario: (req, res, next) => {
      try {
        const { idUsuario, medidas } = req.params;

        console.log({ medidas });

        const ancho = parseInt(medidas.toLowerCase().split('x')[0]);
        const alto = parseInt(medidas.toLowerCase().split('x')[1]);

        if (isNaN(ancho) || isNaN(alto)) {
          const newError = new ErrorHandler('Parametro medida invalida');
          newError.setStatus(400);

          throw newError;
        }

        fetch(`${urlUsuarios}/usuario/perfil/${idUsuario}/${ancho}x${alto}`)
          .then(response => {
            if (!response.ok) {
              return response.json().then(json => {
                const newError = new ErrorHandler(json.error.message || 'Error al solicitar imagen');
                newError.setStatus(json.error.status || 500);
                throw newError;
              });
            }

            return response.arrayBuffer();
          })
          .then(arrayBuffer => {
            const buffer = Buffer.from(arrayBuffer);

            res.type('image/jpeg').send(buffer);
            // res.type('image/jpeg').send(arrayBuffer);
          })
          .catch(err => {
            console.log('entra en catch');
            next(err);
          });

        // .then(blob => {
        //   res.setHeader('Content-Type', 'image/jpeg');
        //   res.send(blob);
        // });
      } catch (e) {
        next(e);
      }
    },
  };
};
