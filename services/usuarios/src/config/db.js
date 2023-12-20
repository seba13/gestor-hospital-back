import mysql from 'mysql2';
import { options } from './keys.js';

export const pool = mysql.createPool(options);

pool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Conexión establecida con éxito');
    connection.release();
  }
});
