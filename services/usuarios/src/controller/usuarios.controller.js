import multer from 'multer';
import sharp from 'sharp';
import usuarioService from '../services/usuarioService.js';
import ErrorHandler from '../errorHandler/errorHandler.js';
// import { File } from 'node-fetch';

export default () => {
  return {
    multerUploadImage: multer({
      fileFilter: (req, file, cb) => {
        const MIMETYPES = ['image/png', 'image/jpeg', 'image/webp'];

        // console.log('entra aca filter');

        // console.log(file);

        if (!MIMETYPES.includes(file.mimetype)) {
          cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 1 * 1024 * 1024 * 10,
        // fieldSize: 1 * 1024 * 1024 * 25,
      },
    }).single('imagenPerfil'),

    actualizarImagenUsuario: (req, res, next) => {
      try {
        const imagen = req.file.buffer;
        const idUsuario = JSON.parse(req.body.idUsuario);
        const mimetype = req.file.mimetype;

        usuarioService()
          .actualizarImagenUsuario(idUsuario, imagen, mimetype)
          .then(resulset => {
            if (resulset && resulset.affectedRows > 0) {
              res.status(200).json({ mensaje: 'IMAGEN ACTUALIZADA CON ÉXITO' });
            } else {
              res.status(200).json({ mensaje: 'NIGUNA FILA FUÉ AFECTADA' });
            }
          });
      } catch (e) {
        next(e);
      }
    },

    obtenerImagenUsuario: (req, res, next) => {
      try {
        const { idUsuario, medidas } = req.params;

        const ancho = parseInt(medidas.toLowerCase().split('x')[0]);
        const alto = parseInt(medidas.toLowerCase().split('x')[1]);

        console.log(idUsuario, medidas);

        // servicio get imagen
        usuarioService()
          .obtenerImagenUsuario(idUsuario)
          .then(result => {
            if (result) {
              if (!(result.imagen_perfil instanceof Buffer)) {
                console.log('entra en throw');

                const newError = new ErrorHandler('Usuario no posee imagen o la imagen es inválida');
                newError.setStatus(500);
                throw newError;
              }

              // console.log(result);
              const extension = result.mimetype_imagen.split('/')[1] || 'image/jpeg';

              // console.log({ extension });

              try {
                sharp(result.imagen_perfil, { animated: true })
                  .resize({ width: ancho, height: alto, fit: 'cover', position: 'top' })
                  .toFormat(extension, {
                    effort: 1,
                  })
                  //   .png()
                  .toBuffer()
                  .then(data => {
                    res.type(result.mimetype_imagen).send(data);
                  })
                  .catch(e => {
                    next(e);
                  });
              } catch (e) {
                next(e);
              }
            }
          })
          .catch(e => {
            next(e);
          });
      } catch (e) {
        next(e);
      }
    },
  };
};
