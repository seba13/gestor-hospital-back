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
     * Devuelve el bloque horario que trabaja el medico
     * y las citas agendadas para la generación de citas disponibles
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    obtenerHorarioCitasDiaMedico: (req, res, next) => {
      console.log('acaca');

      console.log(req.body);

      const { idMedico, fechaCitas, idDia } = req.body;

      try {
        if (!idMedico || !fechaCitas || idDia) {
          const newError = new ErrorHandler('Parametros invalidos');
          newError.setStatus(400);
        }

        const data = {
          idMedico,
          fechaCitas,
          idDia,
        };

        fetch(`${dominio}:${port}/medicos/horario`, {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(data),
        })
          .then(response => {
            if (!response.ok) {
              return response.json().then(json => {
                const newError = new ErrorHandler(json.error.message || 'Error al recibir datos');
                newError.setStatus(json.error.status || 500);

                throw newError;
              });
            }

            return response.json().then(json => {
              res.json(json);
            });
          })
          .catch(e => {
            next(e);
          });
      } catch (e) {
        next(e);
      }
    },

    /**
     * Devuelve los días que trabaja el médico
     * eje: [1,2,3] => lunes, martes, miercoles
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
