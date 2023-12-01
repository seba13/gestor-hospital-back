import express from 'express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import indexRoutes from './src/routes/indexRoutes.js';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: join(__dirname, '../../.env'),
});

const port = process.env.PORT_SERVICIO_EMPLEADOS || 5002;

app.use(indexRoutes);

app.listen(port, () => {
  console.log('microservicio empleados en puerto ' + port);
});
