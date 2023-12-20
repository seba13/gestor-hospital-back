import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: join(__dirname, '../.env'),
});

export default {
  dominio: process.env.PROD === 'false' ? 'http://192.168.0.19' : '',
  urlEmpleados: process.env.URL_EMPLEADOS || 'http://localhost:81',
  urlCitas: process.env.URL_CITAS || 'http://localhost:82',
  urlUsuarios: process.env.URL_USUARIOS || 'http://localhost:83',
  appPort: process.env.APP_PORT || 5000 || 5500,
  portEmpleados: process.env.PORT_SERVICIO_EMPLEADOS || 5005 || 5501,
  portCitas: process.env.PORT_SERVICIO_CITAS || 5006 || 5502,
  portUsuarios: process.env.PORT_SERVICIO_USUARIOS || 5007 || 5503,
  dbHost: process.env.PROD === 'false' ? process.env.DB_HOST : '',
  dbPort: process.env.PROD === 'false' ? process.env.DB_PORT : '',
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
};
