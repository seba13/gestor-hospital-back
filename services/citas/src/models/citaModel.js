import { pool } from '../../../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const promise = pool.promise();

export const getCitas = async () => {
  const [rows] = await promise.query(`select * from cita_medica`);
  return rows;
};
export const setCitaMedica = async parametros => {
  try {
    const { rut,dv, idMedico, hora, fecha, email } = parametros;
    // console.log('PARAMETROS:');
    // console.log(parametros);
    // Función para ejecutar múltiples consultas
    const query1 = await promise.query(`SELECT id_persona FROM persona WHERE rut=?`, [parseInt(rut)]);

    if (query1 && query1[0] && !query1[0][0]) {
      //  si no existe el rut en sistema
      const idPersona = uuidv4();
      const idPaciente = uuidv4();
      const idCita = uuidv4();
      const idFichaMedica = uuidv4();
      try {
        await promise.query(`INSERT INTO persona (id_persona, rut, dv, email) VALUES (?, ?, ?, ?)`, [idPersona, rut, dv, email]); // works
        await promise.query('INSERT INTO detalle_persona (id_persona) VALUES (?)', [idPersona]); // works
        await promise.query(`INSERT INTO ficha_medica (id_ficha_medica) VALUES (?)`, [idFichaMedica]); // works
        await promise.query(`INSERT INTO paciente (id_paciente, id_persona, id_ficha_medica) VALUES (?,?,?)`, [idPaciente, idPersona, idFichaMedica]); // works
        await promise.query(
          'INSERT INTO cita_medica (id_cita_medica, id_estado_cita, cod_medico, id_persona, fecha_cita, hora_cita) VALUES (?, ?,?,?,?,?)',
          [idCita, 4, idMedico, idPaciente, fecha, hora],
        ); // works
        return { response: 'Cita agendada. Usuario nuevo registrado.' };
      } catch (error) {
        console.error("Error, no se agendo la cita, correo existe ya en el sistema.");
        return { response: 'Error al generar cita.' };
      }
    } else {
      // si existe rut
      try {
        const query2 = await promise.query(`select paciente.id_paciente as 'id', persona.rut as rut_paciente from persona
        join paciente on paciente.id_persona=persona.id_persona where rut=?`, [parseInt(rut)]);
        const { id } = query2[0][0];
        const idCita = uuidv4();
        await promise.query(
          'INSERT INTO cita_medica (id_cita_medica, id_estado_cita, cod_medico, id_persona, fecha_cita, hora_cita) VALUES (?, ?,?,?,?,?)',
          [idCita, 4, idMedico, id, fecha, hora],
        ); // works
        return { id: idCita, response: 'Cita agendada.' };
      } catch (error) {
        console.error("Error, no se agendo la cita con usuario existente.");
        return { response: 'Error al generar cita.' };
      }
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    return { error: 'Ocurrió un error al agendar una cita.' };
  }
};

export const getDiasTrabajoMedico = async idMedico => {
  const [rows] = await promise.query(
    ` select dia_horario.id_dia, dia_horario.dia
      from medico
      join horario_Atencion_cita on medico.id_empleado = horario_Atencion_cita.id_empleado 
      join dia_horario on horario_Atencion_cita.id_dia = dia_horario.id_dia
      where medico.id_empleado = ? and horario_Atencion_cita.dia_cita = 1`,
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
