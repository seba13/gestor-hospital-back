import multer from 'multer';
import usuarioService from '../services/usuarioService.js';
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

    actualizarImagen: (req, res, next) => {
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
  };
};
