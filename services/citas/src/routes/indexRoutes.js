import { Router } from 'express';
import citasRoutes from './citasRoutes.js';

const indexRoutes = Router();

indexRoutes.use(citasRoutes);

export default indexRoutes;
