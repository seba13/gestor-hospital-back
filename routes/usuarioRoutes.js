import { Router } from 'express';
import usuariosController from '../controller/usuarios.controller.js';
import { multerErrorHandler } from '../errorHandler/errorHandler.js';

const usuarioRoutes = Router();

// usuarioRoutes.get('/perfil/:idUsuario/:medida');

usuarioRoutes.patch(
  '/usuario/perfil/:idUsuario/actualizar-imagen',
  usuariosController().multerUploadImage,
  usuariosController().actualizarImagenUsuario,
  multerErrorHandler,
);

usuarioRoutes.get('/usuario/perfil/:idUsuario/:medidas', usuariosController().multerUploadImage, usuariosController().obtenerImagenUsuario);

export default usuarioRoutes;
