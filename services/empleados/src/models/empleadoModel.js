import { pool } from '../../../../config/db.js';

const promise = pool.promise();

export const getEspecialidadesMedicas = async () => {
  const [rows] = await promise.query(
    'select especialidad as data, id_doctor as id from doctor',
  );

  return rows;
};
