import { Router } from 'express';
import citasController from '../controller/citas.controller.js';

const citasRoutes = Router();

citasRoutes.get('/citas', citasController().getCitas);
citasRoutes.get('/medicos/:idMedico/dias-citas', citasController().getDiasTrabajoMedico);
citasRoutes.post('/citas/agendar', citasController().setCita);

export default citasRoutes;
