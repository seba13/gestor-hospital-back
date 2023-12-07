import { Router } from 'express';

import medicosRoutes from './medicosRoutes.js';
import citasRoutes from './citasRoutes.js';
import { ErrorHandler } from '../errorHandler/errorHandler.js';
const routerIndex = Router();

routerIndex.use(medicosRoutes);
routerIndex.use(citasRoutes);

routerIndex.get('*', (req, res, next) => {
  const errorHandler = new ErrorHandler('Recurso no encotrado');

  errorHandler.setStatus(404);

  next(errorHandler);
});

export default routerIndex;
