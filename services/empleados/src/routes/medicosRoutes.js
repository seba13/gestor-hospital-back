import medicosController from '../controller/medicos.controller.js';
import { Router } from 'express';

const medicosRoutes = Router();

medicosRoutes.get(
  '/medicos/especialidades',
  medicosController().obtenerEspecialidades,
);
medicosRoutes.get(
  '/medicos/especialidad/:idEspecialidad',
  medicosController().obtenerEspecialidadPorId,
);

medicosRoutes.get(
  '/medicos/fechas/:fecha',
  medicosController().obtenerFechas,
  );
export default medicosRoutes;
