import multer from 'multer';
import sharp from 'sharp';
import { actualizarImagenUsuario, obtenerImagenUsuario, registrarPersona, obteneridPacienteRut } from '../services/usuarioService.js';
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

        actualizarImagenUsuario(idUsuario, imagen, mimetype).then(resulset => {
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

        obtenerImagenUsuario(idUsuario)
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

    registrarNuevoUsuario: async (req, res, next) => {
      const { rut, dv, email, nombre, paterno, materno, idRol = 4, telefono } = req.body;
      try {
        const registroPersona = await registrarPersona({ rut, dv, email, nombre, paterno, materno, idRol, telefono });

        if (registroPersona.response) {
          return res.json({
            response: true,
            message: registrarPersona.message,
          });
        }
      } catch (e) {
        console.log({
          generalMessage: e.message,
          internalMessage: e.internalMessage,
          details: e.details,
        });

        return res.status(e.status || 500).json({
          response: false,
          message: e.message,
          details: e.details,
        });
      }
    },

    personaRegistrada: (req, res, next) => {
      return res.json({
        response: true,
        message: 'persona registrada',
      });
    },

    validarPersona: async (req, res, next) => {
      return res.status(400).json({
        response: true,
        message: 'email coincide ',
      });
    },

    obtenerIdPacienteRut: async (req, res, next) => {
      const { rut } = req.body;

      console.log('controlador obtener idpaciente rut');

      console.log({ rut });

      try {
        const response = await obteneridPacienteRut({ rut });

        console.log({ response });

        if (response.idPaciente) {
          return res.json({
            response: true,
            idPaciente: response.idPaciente,
          });
        }
      } catch (e) {
        return res.status(e.status || 500).json({
          response: false,
        });
      }
    },
  };
};
