import express from 'express';
import config from './src/config/config.js';

import indexRoutes from './src/routes/indexRoutes.js';
import { errorHandler } from '../../errorHandler/errorHandler.js';
const app = express();
app.use(express.json());

app.use(indexRoutes);

// app.use(express.urlencoded({ extended: true }));



app.use(errorHandler);

app.listen(config.portCitas, () => {
  console.log('MICROSERVICIO [CITAS]::' + config.portCitas);
});
