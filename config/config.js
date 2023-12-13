import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: join(__dirname, '../.env'),
});

export default {
  dominio: process.env.PROD === 'false' ? 'http://192.168.0.18' : '',
  appPort: process.env.APP_PORT || 5000 || 5500,
  portEmpleados: process.env.PORT_SERVICIO_EMPLEADOS || 5001 || 5501,
  portCitas: process.env.PORT_SERVICIO_CITAS || 5002 || 5502,
  portUsuarios: process.env.PORT_SERVICIO_USUARIOS || 5003 || 5503,
  dbHost: process.env.PROD === 'false' ? process.env.DB_HOST : '',
  dbPort: process.env.PROD === 'false' ? process.env.DB_PORT : '',
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
};
