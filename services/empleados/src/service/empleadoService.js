import { getEspecialidadesMedicas, getEspecialidadesPorId, getFechas, getMedicosEspecialidad } from '../models/empleadoModel.js';

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
      const medicosEspecialidad = await getMedicosEspecialidad(idEspecialidad);

      medicosEspecialidad.reduce((prev, curr) => {
        // console.log(prev);
        // console.log(curr);

        for (const key in curr) {
          console.log(key);
        }

        curr.imagenUrl = `/usuario/perfil/${curr.idUsuario}/300x300`;

        prev.push(curr);

        return prev;
      }, []);

      console.log(medicosEspecialidad);

      return medicosEspecialidad;
    },
  };
};
