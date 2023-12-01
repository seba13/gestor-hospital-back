import { getEspecialidadesMedicas } from '../models/empleadoModel.js';

export default () => {
  return {
    getEspecialidades: async () => {
      // const especialidades = await getEspecialidadesMedicas();

      // console.log(especialidades);
      // const copyEspecialidades = [];

      // for (let i = 0; i < especialidades.length; i++) {
      //   const especialiad = {};
      //   for (const clave in especialidades[i]) {
      //     especialiad[clave.toLowerCase()] = especialidades[i][clave];
      //   }

      //   copyEspecialidades.push(especialiad);
      // }

      // return copyEspecialidades;

      return await getEspecialidadesMedicas();
    },
  };
};
