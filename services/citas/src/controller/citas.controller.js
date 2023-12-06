import citaService from '../service/citaService.js';

export default () => {
  return {
    obtenerCitas: async (req, res) => {
      res.json(await citaService().getCitas());
    },
    agendarCita: async (req, res) => {
      const {body} = req;
      res.json(await citaService().setCita(body));
    },
  };
};
