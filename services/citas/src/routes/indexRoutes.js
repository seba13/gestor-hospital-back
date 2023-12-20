import { Router } from 'express';
import citasRoutes from './citasRoutes.js';
import ErrorHandler  from '../errorHandler/errorHandler.js';
const indexRoutes = Router();

indexRoutes.use(citasRoutes);


indexRoutes.get('*', (req, res, next) => {
    const errorHandler = new ErrorHandler('Recurso no encotrado');
  
    errorHandler.setStatus(404);
  
    next(errorHandler);
  });

export default indexRoutes;
