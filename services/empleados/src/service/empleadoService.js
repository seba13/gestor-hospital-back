import { getEspecialidadesMedicas, getEspecialidadesPorId, getFechas } from '../models/empleadoModel.js';

export default () => {
  return {
    getEspecialidades: async () => {
      return await getEspecialidadesMedicas();
    },
    getEspecialidadPorId: async (idParam) => {
      return await getEspecialidadesPorId(idParam);
    },
    getFechas: async (fecha) => {
      return await getFechas(fecha);
    }
  };
};
