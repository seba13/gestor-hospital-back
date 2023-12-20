import { Router } from 'express';
import medicosRoutes from './medicosRoutes.js';
import { ErrorHandler } from '../errorHandler/errorHandler.js';

const indexRoutes = Router();

indexRoutes.use(medicosRoutes);


indexRoutes.get('*', (req, res, next) => {
    const errorHandler = new ErrorHandler('Recurso no encotrado');
  
    errorHandler.setStatus(404);
  
    next(errorHandler);
  });

export default indexRoutes;
