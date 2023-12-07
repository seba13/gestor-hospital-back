import { pool } from '../../../../config/db.js';

const promise = pool.promise();

export const getEspecialidadesMedicas = async () => {
  const [rows] = await promise.query('select especialidad as data, id_especialidad as id from especialidad');
  return rows;
};

// works
export const getEspecialidadesPorId = async id => {
  const [rows] = await promise.query(`select id_especialidad as id, especialidad as data from especialidad where id_especialidad='${id}'`);
  return rows;
};

export const getMedicosEspecialidad = async idEspecialidad => {
  const [rows] = await promise.query(
    ` select * 
      from medico
      join empleado on medico.id_empleado = empleado.id_empleado
      where medico.id_especialidad = ?`,
    [idEspecialidad],
  );
  console.log(idEspecialidad);

  console.log(rows);

  return rows;
};


// testing
export const getFechas = async fecha => {
  const [rows] = await promise.query(
    `SELECT cm.id_cita_medica, cm.cod_medico, ec.estado, cm.hora_cita, 
    (SELECT ADDTIME(cm.hora_cita, (SELECT (duracion_citas.duracion_cita*100)))) as hora_fin_cita, duracion_citas.duracion_cita, duracion_descanso.duracion_descanso FROM cita_medica as cm join estado_cita as ec on ec.id_estado_cita=cm.id_estado_cita join medico on medico.cod_medico=cm.cod_medico join empleado on empleado.id_empleado = medico.id_empleado join especialidad on especialidad.id_especialidad=medico.id_especialidad join horario_atencion_cita on horario_atencion_cita.id_empleado=medico.id_empleado join dia_horario on dia_horario.id_dia=horario_atencion_cita.id_dia join duracion_descanso on duracion_descanso.id_duracion_descanso = horario_atencion_cita.id_descanso_post_cita join duracion_citas on duracion_citas.id_duracion_cita=horario_atencion_cita.id_duracion_cita where cm.fecha_cita=? 
    order by cm.hora_cita ASC`,
    [fecha],
  );

  // Obtener solo los valores que deseas agrupar en un nuevo array
  const citas = rows.map(cita => {
    return {
      id_cita: cita.id_cita_medica,
      hora_inicio_cita: cita.hora_cita,
      hora_fin_cita: cita.hora_fin_cita,
    };
  });
  const horas = rows.map(cita => ({
    hora_inicio: cita.hora_cita,
    hora_fin: cita.hora_fin_cita,
  }));
  const resultSet = {
    horas_doctor: horas,
    dia_cita: rows[0].fecha_cita,
    duracion_descanso: rows[0].duracion_descanso,
    duracion_cita: rows[0].duracion_cita,
    citas,
  };
  return resultSet;
};
