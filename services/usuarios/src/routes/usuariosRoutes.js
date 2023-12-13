import { Router } from 'express';
import usuariosController from '../controller/usuarios.controller.js';
import { multerErrorHandler, errorSharp } from '../errorHandler/errorHandler.js';

const usuariosRoutes = Router();

usuariosRoutes.patch(
  '/usuario/perfil/:idUsuario/actualizar-imagen',
  usuariosController().multerUploadImage,
  usuariosController().actualizarImagenUsuario,
  multerErrorHandler,
);

usuariosRoutes.get('/usuario/perfil/:idUsuario/:medidas', usuariosController().obtenerImagenUsuario, errorSharp);

export default usuariosRoutes;
