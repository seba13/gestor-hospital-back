// import { setCitaMedica, getCitas } from '../models/citaModel.js';
import ErrorHandler from '../../../usuarios/src/errorHandler/errorHandler.js';
import { getCitas, getDiasTrabajoMedico, getCitasMedicoDia, getHorarioLaboralMedico } from '../models/citaModel.js';

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

    obtenerHorarioCitasDiaMedico: async ({ idMedico, fechaCitas, idDia }) => {
      console.log('servicio obtener horario citas dia medico');

      console.log({ idMedico, fechaCitas, idDia });

      console.log('*********************************');
      console.log('*********************************');
      console.log('*********************************');
      console.log('*********************************');
      console.log('*********************************');

      const horarioLaboralDiaMedico = await getHorarioLaboralMedico(idMedico, idDia);

      console.log({ horarioLaboralDiaMedico });

      const citasMedicoDia = await getCitasMedicoDia(idMedico, fechaCitas);

      const horarioCitas = horarioLaboralDiaMedico.reduce((prev, curr) => {
        prev.duracion_descanso = curr.duracion_descanso;
        prev.duracion_cita = curr.duracion_cita;

        prev.horas_doctor = prev.horas_doctor ? prev.horas_doctor : [];

        prev.horas_doctor.push({
          hora_inicio: curr.hora_inicio,
          hora_fin: curr.hora_fin,
        });

        return prev;
      }, {});

      const citasMedicas = citasMedicoDia.reduce((prev, curr) => {
        try {
          const fecha = new Date();
          const hora = parseInt(curr.hora_cita.split(':')[0]);
          const minutos = parseInt(curr.hora_cita.split(':')[1]);
          const duracionCita = curr.duracion_cita;

          console.log({ fecha });
          console.log({ hora });
          console.log({ minutos });
          console.log({ duracionCita });

          fecha.setHours(hora);
          fecha.setMinutes(minutos);
          fecha.setMinutes(fecha.getMinutes() + duracionCita);

          const cita = {
            id_cita: curr.id_cita_medica,
            hora_inicio_cita: curr.hora_cita,
            hora_fin_cita: `${fecha.getHours()}:${fecha.getMinutes()}`,
          };

          prev.push(cita);
        } catch (e) {
          const newError = new ErrorHandler('Error al transformar data');
          newError.setStatus(500);
          throw newError;
        }

        return prev;
      }, []);

      console.log({ horarioCitas });
      console.log({ citasMedicas });

      horarioCitas.citas = citasMedicas;
      horarioCitas.fecha = fechaCitas;
      return horarioCitas;
    },
  };
};
