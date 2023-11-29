import { Router } from "express";
import services from '../controller/services.js';
const routerIndex = Router()



routerIndex.get('/', services().microservice1)




export default routerIndex;