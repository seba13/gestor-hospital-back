import { Router } from 'express';
import medicosController from '../controller/medicos.controller.js';

const medicosRoutes = Router();

medicosRoutes.get('/medicos/especialidades', medicosController().getEspecialidades);

medicosRoutes.get('/medicos/especialidad/:idEspecialidad', medicosController().getMedicosEspecialidad);

export default medicosRoutes;
