import { pool } from '../../../../config/db.js';
// import { v4 as uuidv4 } from 'uuid';

const promise = pool.promise();
// const myUUID = uuidv4();

export const getCitas = async () => {
  const [rows] = await promise.query(`select * from cita_medica`);
  return rows;
};

/**
 * consulta que devuelve las citas agendadas con un medico especifico en una
 * fecha especfica.
 * @param {string} idMedico identificador médico
 * @param {string} fechaCitas fecha citas
 * @returns
 */
export const getCitasMedicoDia = async (idMedico, fechaCitas) => {
  console.log('**************');
  console.log('**************');
  console.log('**************');
  console.log('**************');
  console.log({ idMedico, fechaCitas });
  console.log('**************');
  console.log('**************');
  console.log('**************');
  console.log('**************');

  const [rows] = await promise.query(
    `
    select date_format(cita_medica.fecha_cita,'%y-%m-%d') as fecha_cita, time_format(cita_medica.hora_cita, '%H:%i') as hora_cita, duracion_citas.duracion_cita, cita_medica.id_cita_medica
    from cita_medica
    join horario_cita on horario_cita.id_cita = cita_medica.id_cita_medica
    join horario_atencion_cita on horario_Atencion_cita.id_horario = horario_cita.id_horario_atencion
    join empleado on horario_atencion_cita.id_empleado = empleado.id_empleado
    join medico on medico.id_empleado = empleado.id_empleado
    join duracion_citas on cita_medica.id_duracion_cita = duracion_citas.id_duracion_cita
    where medico.cod_medico = ? and cita_medica.fecha_cita = ?`,
    [idMedico, fechaCitas],
  );

  return rows;
};

/**
 * Devuelve un array con el o los bloques horarios del médico en un dia especifico
 * @param {string} idMedico identificador médico
 * @param {int} idDia identificador dia
 */
export const getHorarioLaboralMedico = async (idMedico, idDia) => {
  const [rows] = await promise.query(
    `
    select time_format(detalle_horario_atencion.hora_inicio, '%H:%i') as hora_inicio, time_format(detalle_horario_atencion.hora_fin,'%H:%i') as hora_fin, duracion_descanso, duracion_citas.duracion_cita
    from horario_Atencion_Cita 
    join duracion_descanso on duracion_descanso.id_duracion_descanso = horario_Atencion_Cita.id_descanso_post_cita
    join duracion_citas on duracion_citas.id_duracion_cita = horario_Atencion_Cita.id_duracion_cita
    join detalle_horario_atencion on horario_atencion_cita.id_horario = detalle_horario_atencion.id_horario
    join empleado on horario_atencion_cita.id_empleado = empleado.id_empleado
    join medico on medico.id_empleado = empleado.id_empleado
    where medico.cod_medico = ? and id_dia=?
    `,
    [idMedico, idDia],
  );

  return rows;
};

/**
 * devuelve los dias en que el médico trabaja
 * ej: [1,3,5] => trabaja lunes miercoles y viernes.
 * @param {string} idMedico identificador médico
 * @returns
 */
export const getDiasTrabajoMedico = async idMedico => {
  const [rows] = await promise.query(
    ` select dia_horario.id_dia, dia_horario.dia
      from medico
      join horario_Atencion_cita on medico.id_empleado = horario_Atencion_cita.id_empleado 
      join dia_horario on horario_Atencion_cita.id_dia = dia_horario.id_dia
      where medico.cod_medico = ? and horario_Atencion_cita.dia_cita = 1`,
    [idMedico],
  );

  return rows;
};

// export const setCitaMedica = async params => {
//   const { rut, medico, dia_cita, hora_cita, email, telefono } = params;
//   const [rows] = await promise.query(
//     `select (id_persona) from persona where rut like '%?%'`,
//     [parseInt(rut)],
//   );

//   if (rows.length == 0) { //si no existe este rut en sistema
//     const query1 = "insert into persona (id_persona, rut, dv, email) values(?, ?, ?, ?)";
//     const query2 = "insert into detalle_persona(id_persona, direccion) values ();";
//     const [rows2] = await promise.query(query1, [myUUID, rut, "0", email]);

//     return {datos:"sucess"};
//   }
//   return [];
// };
