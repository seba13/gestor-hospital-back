import { pool } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import ErrorHandler from '../errorHandler/errorHandler.js';
const promise = pool.promise();

export const iniciarTransaccion = async () => {
  return await promise.query('start transaction');
};

export const guardarTransaccion = async () => {
  return await promise.query('commit');
};

export const devolverTransaccion = async () => {
  return await promise.query('rollback');
};

export const getCitasModel = async () => {
  const [rows] = await promise.query(`select * from cita_medica`);
  return rows;
};
export const setCitaMedicaModel = async parametros => {
  try {
    const { rut, dv, idMedico, hora, fecha, email, duracionCita, nombre, paterno, materno, telefono } = parametros;
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
      const nuevaClave = rut.substring(0, 4);
      try {
        try {
          await promise.query(`INSERT INTO persona (id_persona, rut, dv, email, nombre, paterno, materno) VALUES (?, ?, ?, ?,?,?,?)`, [
            idPersona,
            rut,
            dv,
            email,
            nombre,
            paterno,
            materno,
          ]); // works
          await promise.query(`INSERT INTO usuario (id_usuario, usuario, contrasena, id_persona, id_rol) VALUES (?, ?, ?, ?, ?)`, [
            uuidv4(),
            email,
            nuevaClave,
            idPersona,
            5,
          ]); // works
          await promise.query(`INSERT INTO detalle_persona (id_persona) VALUES (?)`, [idPersona]); // works

          await promise.query(
            `INSERT INTO telefono_persona (id_detalle_persona, telefono) VALUES ((select id_detalle_persona from detalle_persona where detalle_persona.id_persona=?), ?)`,
            [idPersona, telefono],
          ); // works
        } catch (error) {
          console.error('ERROR AL CREAR PERSONA.');
          console.error(error);
        }

        try {
          await promise.query(`INSERT INTO ficha_medica (id_ficha_medica) VALUES (?)`, [idFichaMedica]); // works
          await promise.query(`INSERT INTO paciente (id_paciente, id_persona, id_ficha_medica) VALUES (?,?,?)`, [
            idPaciente,
            idPersona,
            idFichaMedica,
          ]);
        } catch (error) {
          console.error('ERROR AL CREAR PACIENTE.');
          console.error(error);
        }
        try {
          const idHorarioAtencion = await promise.query('select dc.id_duracion_cita as id from duracion_citas dc where dc.duracion_cita = ?', [
            parseInt(duracionCita),
          ]);
          const { id } = idHorarioAtencion[0][0];
          await promise.query('INSERT INTO cita_medica VALUES (?, ?,?,?,?,?,?)', [idCita, 4, idMedico, idPaciente, fecha, hora, id]);
          await promise.query(
            'INSERT INTO horario_cita VALUES (?, (select id_horario from horario_atencion_cita h join dia_horario on dia_horario.id_dia=h.id_dia where h.id_empleado=(SELECT id_empleado FROM medico where cod_medico=?) and dia_horario.dia=(select dayname(?))) );',
            [idCita, idMedico, fecha],
          ); // test
        } catch (error) {
          console.error('ERROR AL CREAR CITA MEDICA.');
          console.error(error);
        }

        return { response: 'OK', message: 'Cita agendada. Usuario nuevo registrado.' };
      } catch (error) {
        console.error('ERROR AL CREAR CITA MEDICA.');
        console.error(error);
        return { response: 'ERROR', message: 'Error al generar cita.' };
      }
    } else {
      // si existe rut
      try {
        const query2 = await promise.query(
          `select paciente.id_paciente as 'id', persona.rut as rut_paciente from persona
        join paciente on paciente.id_persona=persona.id_persona where rut=?`,
          [parseInt(rut)],
        );
        const { id } = query2[0][0];
        const idCita = uuidv4();
        const resultQuery = await promise.query(`select dc.id_duracion_cita as id from duracion_citas dc where dc.duracion_cita = ?`, [
          parseInt(duracionCita),
        ]);
        await promise.query(
          'INSERT INTO cita_medica (id_cita_medica, id_estado_cita, cod_medico, id_paciente, fecha_cita, hora_cita, id_duracion_cita) VALUES (?, ?,?,?,?,?,?)',
          [idCita, 4, idMedico, id, fecha, hora, parseInt(resultQuery[0][0].id)],
        ); // works
        await promise.query(
          `insert into horario_cita values (?, 
            (select id_horario from horario_atencion_cita h
            join dia_horario on dia_horario.id_dia=h.id_dia
          where h.id_empleado=(select id_empleado from medico where cod_medico=?)
          and dia_horario.dia=(select dayname(?)))
          )`,
          [idCita, idMedico, fecha],
        ); // test
        return { response: 'OK', message: 'Cita agendada.' };
      } catch (error) {
        console.error('Error, no se agendo la cita con usuario existente.');
        return { response: 'ERROR', message: 'Error al generar cita.' };
      }
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    return { response: 'ERROR', message: 'Ocurrió un error al agendar una cita.' };
  }
};

export const obtenerIdDuracionCitaModel = async ({ duracionCita }) => {
  try {
    const [rows] = await promise.query('select id_duracion_cita as idDuracionCita from duracion_citas where duracion_cita = ?', [
      parseInt(duracionCita),
    ]);
    return rows[0];
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al obtener id duracion cita');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const registrarCitaMedicaModel = async ({ idCita, estadoCita, idMedico, idPaciente, fecha, hora, idDuracionCita }) => {
  try {
    const [ResultSetHeader] = await promise.query(
      'INSERT INTO cita_medica(id_cita_medica, id_estado_cita, cod_medico, id_paciente, fecha_cita, hora_cita, id_duracion_cita) VALUES (?,?,?,?,?,?,?)',
      [idCita, estadoCita, idMedico, idPaciente, fecha, hora, idDuracionCita],
    );

    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al registrar cita médica');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const registrarHorarioCitaModel = async ({ idCita, idHorario }) => {
  try {
    const [ResultSetHeader] = await promise.query('INSERT INTO horario_cita(id_cita, id_horario_atencion) values(?,?)', [idCita, idHorario]);

    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al registrar horario cita médica');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const obtenerIdEmpleadoModel = async ({ idMedico }) => {
  try {
    const [rows] = await promise.query(`SELECT id_empleado as idEmpleado from medico where cod_medico = ?`, [idMedico]);

    return rows[0];
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al obtener id empleado ');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const obtenerIdHorarioAtencionCitaModel = async ({ idEmpleado, diaSemana }) => {
  console.log({ idEmpleado, diaSemana });

  try {
    const [rows] = await promise.query(`select id_horario as idHorario from horario_atencion_cita where id_empleado = ? and id_dia = ? `, [
      idEmpleado,
      diaSemana,
    ]);

    return rows[0];
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al obtener id horario atencion ');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

/**
 * consulta que devuelve las citas agendadas con un medico especifico en una
 * fecha especfica.
 * @param {string} idMedico identificador médico
 * @param {string} fechaCitas fecha citas
 * @returns
 */
export const getCitasMedicoDiaModel = async (idMedico, fechaCitas) => {
  const [rows] = await promise.query(
    `
    select date_format(cita_medica.fecha_cita,'%Y-%m-%d') as fecha_cita, time_format(cita_medica.hora_cita, '%H:%i') as hora_cita, duracion_citas.duracion_cita, cita_medica.id_cita_medica
    from cita_medica
    join horario_cita on horario_cita.id_cita = cita_medica.id_cita_medica
    join horario_atencion_cita on horario_atencion_cita.id_horario = horario_cita.id_horario_atencion
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
export const getHorarioLaboralMedicoModel = async (idMedico, idDia) => {
  const [rows] = await promise.query(
    `
    select time_format(detalle_horario_atencion.hora_inicio, '%H:%i') as hora_inicio, time_format(detalle_horario_atencion.hora_fin,'%H:%i') as hora_fin, duracion_descanso, duracion_citas.duracion_cita
    from horario_atencion_cita 
    join duracion_descanso on duracion_descanso.id_duracion_descanso = horario_atencion_cita.id_descanso_post_cita
    join duracion_citas on duracion_citas.id_duracion_cita = horario_atencion_cita.id_duracion_cita
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
export const getDiasTrabajoMedicoModel = async idMedico => {
  const [rows] = await promise.query(
    ` select dia_horario.id_dia, dia_horario.dia
      from medico
      join horario_atencion_cita on medico.id_empleado = horario_atencion_cita.id_empleado 
      join dia_horario on horario_atencion_cita.id_dia = dia_horario.id_dia
      where medico.cod_medico = ? and horario_atencion_cita.dia_cita = 1`,
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
