import { getCitas, getDiasTrabajoMedico, obtenerHorarioCitasDiaMedico, agendarCitaMedica } from '../service/citaService.js';

export default () => {
  return {
    obtenerCitas: async (req, res) => {
      res.json(await getCitas());
    },
    agendarCita: async (req, res, next) => {
      const { rut, dv, idMedico, hora, fecha, email, duracionCita, nombre, paterno, materno, telefono, idRol, diaSemana } = req.body;

      try {
        const registroCita = await agendarCitaMedica({
          rut,
          dv,
          idMedico,
          hora,
          fecha,
          email,
          duracionCita,
          nombre,
          paterno,
          materno,
          telefono,
          idRol,
          diaSemana,
        });

        return res.json({
          response: true,
          message: registroCita.message,
        });
      } catch (e) {
        console.log({
          generalMessage: e.message,
          internalMessage: e.internalMessage,
          details: e.details,
        });

        return res.status(e.status || 500).json({
          response: false,
          message: e.message,
          details: e.details,
        });
      }
    },

    obtenerDiasTrabajo: async (req, res, next) => {
      try {
        const { idMedico } = req.params;

        let diasTrabajo = await getDiasTrabajoMedico(idMedico);

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

      try {
        const horarioCita = await obtenerHorarioCitasDiaMedico({ idMedico, fechaCitas, idDia });

        return res.json(horarioCita);
      } catch (e) {
        next(e);
      }
    },
  };
};
