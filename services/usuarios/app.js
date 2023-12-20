import express from 'express';
import config from './src/config/config.js';
import indexRoutes from './src/routes/indexRoutes.js';
import { errorMessage, errorHandler } from './src/errorHandler/errorHandler.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(indexRoutes);

app.use(errorMessage, errorHandler);

app.listen(config.portUsuarios, () => {
  console.log('microservicio usuarios en puerto ' + config.portUsuarios);
});
