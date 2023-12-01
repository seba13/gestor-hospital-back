import medicosController from '../controller/medicos.controller.js';
import { Router } from 'express';

const medicosRoutes = Router();

medicosRoutes.get(
  '/medicos/especialidades',
  medicosController().obtenerEspecialidades,
);

export default medicosRoutes;
