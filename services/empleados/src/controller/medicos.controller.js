import medicosService from '../service/empleadoService.js';

export default () => {
  return {
    obtenerEspecialidades: async (req, res, next) => {
      try {
        res.json(await medicosService().getEspecialidades());
      } catch (e) {
        next(e);
      }
    },

    obtenerMedicosEspecialidad: async (req, res, next) => {
      try {
        const { idEspecialidad } = req.params;

        res.json(await medicosService().getMedicosEspecialidad(idEspecialidad));
      } catch (e) {
        next(e);
      }
    },

    
    obtenerEspecialidadPorId: async (req, res) => {
      const { params } = req;
      res.json(await medicosService().getEspecialidadPorId(params.idEspecialidad));
    },
    obtenerFechas: async (req, res) => {
      const { params } = req;
      res.json(await medicosService().getFechas(params.fecha));
    },
  };
};
