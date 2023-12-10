import fetch from 'node-fetch';
import config from '../config/config.js';
import { ErrorHandler } from '../errorHandler/errorHandler.js';

const citasController = () => {
  const dominio = config.dominio;
  const port = config.portCitas;

  return {
    getCitas: (req, res, next) => {
      fetch(`${dominio}:${port}/citas`)
        .then(result => result.json())
        .then(json => {
          if (json.error) {
            const newError = new ErrorHandler(json.error.message);
            newError.setStatus(json.error.status);
            throw newError;
          }

          res.send(json);
        })
        .catch(e => {
          next(e);
        });
    },
    setCita: (req, res, next) => {
      fetch(`${dominio}:${port}/citas/agendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica que se envía un cuerpo JSON
        },
        body: JSON.stringify(req.body), // Coloca el cuerpo fuera de los encabezados
      })
        .then(result => result.json())
        .then(json => {
          if (json.error) {
            const newError = new ErrorHandler(json.error.message);
            newError.setStatus(json.error.status);
            throw newError;
          }

          res.send(json);
        })
        .catch(e => {
          next(e);
        });
    },

    /**
     * Devuelve los días que trabaja el médico
     *
     * @param {*} req params
     * @param {*} res
     * @param {*} next
     * @param {string} req.params.idMedica
     */
    getDiasTrabajoMedico: (req, res, next) => {
      const { idMedico } = req.params;

      fetch(`${dominio}:${port}/medicos/${idMedico}/dias-citas`)
        .then(result => result.json())
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

export default citasController;
