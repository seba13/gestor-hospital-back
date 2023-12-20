import { Router } from 'express';
import usuariosController from '../controller/usuarios.controller.js';
import { multerErrorHandler, errorSharp } from '../errorHandler/errorHandler.js';

import { validarPersonaRegistro, validarRut, validarEmail } from '../middlewares/auth.middleware.js';

const usuariosRoutes = Router();

usuariosRoutes.patch(
  '/usuario/perfil/:idUsuario/actualizar-imagen',
  usuariosController().multerUploadImage,
  usuariosController().actualizarImagenUsuario,
  multerErrorHandler,
);

usuariosRoutes.get('/usuario/perfil/:idUsuario/:medidas', usuariosController().obtenerImagenUsuario, errorSharp);

// VALIDACION Y REGISTRO USUARIO

usuariosRoutes.post('/registrar-usuario', validarPersonaRegistro, usuariosController().registrarNuevoUsuario);

usuariosRoutes.post('/persona-registrada', validarRut, usuariosController().personaRegistrada);

usuariosRoutes.post('/validar-email', validarEmail, usuariosController().validarPersona);

usuariosRoutes.post('/usuario/obtener-idpaciente', usuariosController().obtenerIdPacienteRut);

export default usuariosRoutes;
