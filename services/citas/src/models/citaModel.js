import { pool } from '../../../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const promise = pool.promise();
const myUUID = uuidv4();

export const getCitas = async () => {
  const [rows] = await promise.query(`select * from cita_medica`);
  return rows;
};

export const setCitaMedica = async params => {
  const { rut, medico, dia_cita, hora_cita, email, telefono } = params;
  const [rows] = await promise.query(
    `select (id_persona) from persona where rut like '%?%'`,
    [parseInt(rut)],
  );
  
  if (rows.length == 0) { //si no existe este rut en sistema
    const query1 = "insert into persona (id_persona, rut, dv, email) values(?, ?, ?, ?)";
    const query2 = "insert into detalle_persona(id_persona, direccion) values ();";
    const [rows2] = await promise.query(query1, [myUUID, rut, "0", email]);
      
    return {datos:"sucess"};
  }
  return [];
};
