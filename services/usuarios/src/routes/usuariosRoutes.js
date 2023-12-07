import { Router } from 'express';
import usuariosController from '../controller/usuarios.controller.js';
import { multerErrorHandler } from '../errorHandler/errorHandler.js';

const usuariosRoutes = Router();

usuariosRoutes.patch(
  '/usuario/perfil/:idUsuario/actualizar-imagen',
  usuariosController().multerUploadImage, usuariosController().actualizarImagen, multerErrorHandler
);

export default usuariosRoutes;
