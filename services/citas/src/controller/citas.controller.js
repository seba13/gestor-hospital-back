import citaService from '../service/citaService.js';

export default () => {
  return {
    obtenerCitas: async (req, res) => {
      res.json(await citaService().getCitas());
    },
    agendarCita: async (req, res) => {
      const { body } = req;
      res.json(await citaService().setCita(body));
    },

    obtenerDiasTrabajo: async (req, res, next) => {
      try {
        const { idMedico } = req.params;

        let diasTrabajo = await citaService().getDiasTrabajoMedico(idMedico);

        diasTrabajo = diasTrabajo.reduce((prev, curr) => {
          prev.push(curr.id_dia);

          return prev;
        }, []);

        return res.status(200).json(diasTrabajo);
      } catch (e) {
        next(e);
      }
    },

    obtenerHorarioCitasDiaMedico: async (req, res, next) => {
      const { idMedico, fechaCitas, idDia } = req.body;

      // console.log('servicio citas');

      // console.log({ idMedico, fechaCitas, idDia });

      try {
        const horarioCita = await citaService().obtenerHorarioCitasDiaMedico({ idMedico, fechaCitas, idDia });

        return res.json(horarioCita);
      } catch (e) {
        next(e);
      }
    },
  };
};
