import express from 'express';
import config from './config/config.js';
import morgan from 'morgan';
import routerIndex from './routes/indexRoutes.js';
import cors from 'cors';
import { errorHandler } from './errorHandler/errorHandler.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.use(routerIndex);

app.use(errorHandler);
app.listen(config.appPort, () => {
  console.log('server on port ' + config.appPort);
});
