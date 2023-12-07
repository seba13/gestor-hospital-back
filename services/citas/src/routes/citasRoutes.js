import citasController from '../controller/citas.controller.js';
import { Router } from 'express';

const citasRoutes = Router();

citasRoutes.get('/citas', citasController().obtenerCitas);
citasRoutes.post('/citas/agendar', citasController().agendarCita);

citasRoutes.get('/medicos/:idMedico/dias_citas', citasController().obtenerDiasTrabajo);

export default citasRoutes;
