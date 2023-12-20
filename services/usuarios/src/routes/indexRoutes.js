import { Router } from 'express';
import usuarioRoutes from './usuariosRoutes.js';
import ErrorHandler  from '../errorHandler/errorHandler.js';
const indexRoutes = Router();

indexRoutes.use(usuarioRoutes);

indexRoutes.get('*', (req, res, next) => {
  const errorHandler = new ErrorHandler('Recurso no encotrado');

  errorHandler.setStatus(404);

  next(errorHandler);
});

export default indexRoutes;
