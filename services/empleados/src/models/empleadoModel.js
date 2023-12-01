import { pool } from '../../../../config/db.js';

const promise = pool.promise();

export const getEspecialidadesMedicas = async () => {
  const [rows] = await promise.query('select * from doctor');

  return rows;
};
