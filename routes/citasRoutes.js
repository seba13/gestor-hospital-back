import { Router } from 'express';
import citasController from '../controller/citas.controller.js';

const citasRoutes = Router();

citasRoutes.get('/citas', citasController().getCitas);


citasRoutes.get('/medicos/:idMedico/dias-citas', citasController().getDiasTrabajoMedico);

export default citasRoutes;
