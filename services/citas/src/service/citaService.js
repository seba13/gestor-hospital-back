// import { setCitaMedica, getCitas } from '../models/citaModel.js';
import ErrorHandler from '../../../usuarios/src/errorHandler/errorHandler.js';
import { fetchObtenerIdPacienteRut } from '../utils/fetchValidateUser.js';
import { stringHoraToDate } from '../utils/stringDate.js';

import {
  getCitasModel,
  getDiasTrabajoMedicoModel,
  getCitasMedicoDiaModel,
  getHorarioLaboralMedicoModel,
  setCitaMedicaModel,
  obtenerIdDuracionCitaModel,
  registrarCitaMedicaModel,
  registrarHorarioCitaModel,
  obtenerIdHorarioAtencionCitaModel,
  iniciarTransaccion,
  devolverTransaccion,
  guardarTransaccion,
  obtenerIdEmpleadoModel,
} from '../models/citaModel.js';

import { v4 as uuidv4 } from 'uuid';

export const getCitas = async () => await getCitasModel();

export const getDiasTrabajoMedico = async idMedico => {
  return await getDiasTrabajoMedicoModel(idMedico);
};
export const setCitaMedica = async parametros => {
  // console.log("datos servicio: "+parametros.rut);
  return await setCitaMedicaModel(parametros);
};

export const agendarCitaMedica = async ({
  rut,
  dv,
  idMedico,
  hora,
  fecha,
  email,
  duracionCita,
  nombre,
  paterno,
  materno,
  telefono,
  idRol,
  diaSemana,
}) => {
  console.log('servicio agendar cita');

  const idCita = uuidv4();
  const estadoCita = 4;

  try {
    await iniciarTransaccion();

    const { idDuracionCita } = await obtenerIdDuracionCitaModel({ duracionCita });

    console.log('SERVICIO REGISTRO CITA');
    console.log({ rut });

    const { idPaciente } = await fetchObtenerIdPacienteRut({ rut });

    console.log({ idPaciente });

    const resultRegistrarCitaMedica = await registrarCitaMedicaModel({ idCita, idPaciente, estadoCita, idMedico, fecha, hora, idDuracionCita });

    const { idEmpleado } = await obtenerIdEmpleado({ idMedico });

    const { idHorario } = await obtenerIdHorarioAtencionCita({ idEmpleado, diaSemana });

    const resultRegistrarHorarioCita = await registrarHorarioCitaModel({ idCita, idHorario });

    if (resultRegistrarCitaMedica.affectedRows && resultRegistrarHorarioCita.affectedRows) {
      guardarTransaccion();

      return { response: true, message: 'cita agendada con éxito' };
    }
  } catch (e) {
    await devolverTransaccion();
    throw e;
  }
};

// setCita: async (params) => await setCitaMedica(params),

export const obtenerIdEmpleado = async ({ idMedico }) => {
  return await obtenerIdEmpleadoModel({ idMedico });
};

export const obtenerIdHorarioAtencionCita = async ({ idEmpleado, diaSemana }) => {
  return await obtenerIdHorarioAtencionCitaModel({ idEmpleado, diaSemana });
};

export const obtenerHorarioCitasDiaMedico = async ({ idMedico, fechaCitas, idDia }) => {
  
  const horarioLaboralDiaMedico = await getHorarioLaboralMedicoModel(idMedico, idDia);

  const citasMedicoDia = await getCitasMedicoDiaModel(idMedico, fechaCitas);

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

  horarioCitas.citas = citasMedicas;
  horarioCitas.fecha = fechaCitas;
  return horarioCitas;
};

export const colisionCita = async ({ fechaCitas, idMedico, hora, duracionCita }) => {
  const citasMedicas = await getCitasMedicoDiaModel(idMedico, fechaCitas);

  // return citasMedicas.some(cita => {
  //   console.log({ fechaCitas, hora });
  //   console.log({ cita });

  //   return fechaCitas === cita.fecha_cita && hora === cita.hora_cita;
  // });

  for (let i = 0; i < citasMedicas.length; i++) {
    if (hora === citasMedicas[i].hora_cita) return { response: true, message: 'Cita ya se encuentra agendada' };

    const horaInicioPosibleCita = stringHoraToDate(hora);
    const horaFinPosibleCita = new Date(horaInicioPosibleCita);
    horaFinPosibleCita.setMinutes(horaFinPosibleCita.getMinutes() + duracionCita);

    const horaInicioCita = stringHoraToDate(citasMedicas[i].hora_cita);
    const horaFinCita = new Date(horaInicioCita);
    horaFinCita.setMinutes(horaFinCita.getMinutes() + citasMedicas[i].duracion_cita);

    if (horaInicioPosibleCita < horaInicioCita && horaFinPosibleCita >= horaFinCita)
      return { response: true, message: 'Cita colisiona con otra cita agendada' };

    if (horaInicioPosibleCita < horaInicioCita && horaFinPosibleCita >= horaInicioCita && horaFinPosibleCita <= horaFinCita)
      return { response: true, message: 'Cita colisiona con otra cita agendada' };

    if (horaInicioPosibleCita >= horaInicioCita && horaInicioPosibleCita <= horaFinCita && horaFinPosibleCita >= horaFinCita)
      return { response: true, message: 'Cita colisiona con otra cita agendada' };

    if (horaInicioPosibleCita >= horaInicioCita && horaFinPosibleCita >= horaInicioCita && horaFinPosibleCita <= horaFinCita)
      return { response: true, message: 'Cita colisiona con otra cita agendada' };
  }

  return { response: false };
};
