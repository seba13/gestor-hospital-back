import medicosService from '../service/empleadoService.js';

export default () => {
  return {
    obtenerEspecialidades: async (req, res) => {
      res.json(await medicosService().getEspecialidades());
    },
  };
};
