import citasController from '../controller/citas.controller.js';
import { Router } from 'express';
import { validateUser } from '../middlewares/validateUser.middleware.js';
import {validarCita} from '../middlewares/colisionCita.middleware.js'
const citasRoutes = Router();

citasRoutes.get('/citas', citasController().obtenerCitas);
citasRoutes.post('/citas/agendar', validarCita, validateUser, citasController().agendarCita);

citasRoutes.get('/medicos/:idMedico/dias-citas', citasController().obtenerDiasTrabajo);

citasRoutes.post('/medicos/horario', citasController().obtenerHorarioCitasDiaMedico);

export default citasRoutes;
