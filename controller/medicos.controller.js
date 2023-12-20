import fetch from 'node-fetch';
import config from '../config/config.js';
import { ErrorHandler } from '../errorHandler/errorHandler.js';

const medicosController = () => {
  const { urlEmpleados } = config;

  return {
    getEspecialidades: (req, res, next) => {
      fetch(`${urlEmpleados}/medicos/especialidades`)
        .then(result => result.json())
        .then(json => {
          console.log(json);

          if (json.error) {
            const newError = new ErrorHandler(json.error.message);
            newError.setStatus(json.error.status);
            throw newError;
          }

          return res.status(200).json(json);
        })
        .catch(e => {
          next(e);
        });
    },

    // /medicos/especialidad/:idEspecialidad

    getMedicosEspecialidad: (req, res, next) => {
      const { idEspecialidad } = req.params;

      fetch(`${urlEmpleados}/medicos/especialidad/${idEspecialidad}`)
        .then(result => {
          return result.json();
        })
        .then(json => {
          if (json.error) {
            const newError = new ErrorHandler(json.error.message);
            newError.setStatus(json.error.status);
            throw newError;
          }
          return res.status(200).json(json);
        })
        .catch(e => {
          next(e);
        });
    },
  };
};

export default medicosController;
