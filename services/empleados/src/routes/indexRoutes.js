import { Router } from 'express';
import medicosRoutes from './medicosRoutes.js';

const indexRoutes = Router();

indexRoutes.use(medicosRoutes);

export default indexRoutes;
