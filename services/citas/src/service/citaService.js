// import { setCitaMedica, getCitas } from '../models/citaModel.js';
import { getCitas, getDiasTrabajoMedico, setCitaMedica } from '../models/citaModel.js';

export default () => {
  return {
    getCitas: async () => (await getCitas()),

    getDiasTrabajoMedico: async idMedico => {
      return await getDiasTrabajoMedico(idMedico);
    },
    setCitaMedica: async parametros => {
      // console.log("datos servicio: "+parametros.rut);
      return await setCitaMedica(parametros);
    },
    // setCita: async (params) => await setCitaMedica(params),
  };
};
