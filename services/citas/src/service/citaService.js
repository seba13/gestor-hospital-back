// import { setCitaMedica, getCitas } from '../models/citaModel.js';
import { getCitas, getDiasTrabajoMedico } from '../models/citaModel.js';

export default () => {
  return {
    getCitas: async () => await getCitas(),

    getDiasTrabajoMedico: async idMedico => {
      return await getDiasTrabajoMedico(idMedico);
    },
    // setCita: async (params) => await setCitaMedica(params),
  };
};
