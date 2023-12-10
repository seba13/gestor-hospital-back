import citaService from '../service/citaService.js';

export default () => {
  return {
    obtenerCitas: async (req, res) => {
      res.json(await citaService().getCitas());
    },
    agendarCita: async (req, res, next) => {
      try {
        return res.status(200).json(await citaService().setCitaMedica(req.body));
      } catch (e) {
        next(e);
      }
    },

    obtenerDiasTrabajo: async (req, res, next) => {
      try {
        const { idMedico } = req.params;
        return res.status(200).json(await citaService().getDiasTrabajoMedico(idMedico));
      } catch (e) {
        next(e);
      }
    },
  };
};
