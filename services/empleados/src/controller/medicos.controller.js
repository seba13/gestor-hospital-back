import medicosService from '../service/empleadoService.js';

export default () => {
  return {
    obtenerEspecialidades: async (req, res) => {
      res.json(await medicosService().getEspecialidades());
    },
    obtenerEspecialidadPorId: async (req, res) => {
      let {params} = req;
      res.json(await medicosService().getEspecialidadPorId(params.idEspecialidad));
    },
    obtenerFechas: async (req, res) => {
      let {params} = req;
      res.json(await medicosService().getFechas(params.fecha));
    },
  };
};
