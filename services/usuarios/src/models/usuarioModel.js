import { pool } from '../../../../config/db.js';

const promise = pool.promise();

export const actualizarImagenUsuario = async (idUsuario, imagen, mimetype) => {
  const [resulset] = await promise.query(
    `
        update usuario
        set imagen_perfil = ? ,
        mimetype_imagen = ?
        where id_usuario = ?`,
    [imagen, mimetype, idUsuario],
  );

  return resulset;
};

export const obtenerImagenUsuarioModel = async idUsuario => {
  const [rows] = await promise.query(
    `
    select imagen_perfil, mimetype_imagen
    from usuario
    where id_usuario = ?
    `,
    [idUsuario],
  );

  return rows[0];
};
