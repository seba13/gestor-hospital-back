import { Router } from 'express';
import usuarioRoutes from './usuariosRoutes.js';

const indexRoutes = Router();
indexRoutes.use(usuarioRoutes);

export default indexRoutes;
