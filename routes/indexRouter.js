import { Router } from 'express';
import services from '../controller/services.js';
const routerIndex = Router();

routerIndex.get('/medicos/especialidades', services().getEspecialidades);

export default routerIndex;
