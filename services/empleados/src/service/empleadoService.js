import {
  getEspecialidadesMedicas,
  getEspecialidadesPorId,
  getFechas,
  getMedicosEspecialidad,
} from '../models/empleadoModel.js';

export default () => {
  return {
    getEspecialidades: async () => {
      return await getEspecialidadesMedicas();
    },
    getEspecialidadPorId: async idParam => {
      return await getEspecialidadesPorId(idParam);
    },
    getFechas: async fecha => {
      return await getFechas(fecha);
    },
    getMedicosEspecialidad: async idEspecialidad => {
      return await getMedicosEspecialidad(idEspecialidad);
    },
  };
};
