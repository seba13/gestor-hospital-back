import express from 'express';
import config from './src/config/config.js';
import { errorMessage, errorHandler } from './src/errorHandler/errorHandler.js';
import indexRoutes from './src/routes/indexRoutes.js';
const app = express();

app.use(indexRoutes);

app.use(errorMessage, errorHandler);

app.listen(config.portEmpleados, () => {
  console.log('microservicio empleados en puerto ' + config.portEmpleados);
});
