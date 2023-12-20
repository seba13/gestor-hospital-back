import { pool } from '../../../../config/db.js';
import ErrorHandler from '../errorHandler/errorHandler.js';

const promise = pool.promise();

export const iniciarTransaccion = async () => {
  return await promise.query(`start transaction`);
};

export const guardarTransaccion = async () => {
  return await promise.query(`commit`);
};

export const devolverTransaccion = async () => {
  return await promise.query(`rollback`);
};

export const actualizarImagenUsuarioModel = async (idUsuario, imagen, mimetype) => {
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

export const obtenerPersonaRutModel = async ({ rut }) => {
  const [rows] = await promise.query(`Select rut, email from persona where persona.rut= ?`, [rut]);

  return rows[0];
};

export const obtenerPersonaEmailModel = async ({ email }) => {
  const [rows] = await promise.query(`Select rut, email from persona where persona.email= ?`, [email]);

  return rows[0];
};

export const obtenerIdPacienteRut = async ({ rut }) => {
  const [rows] = await promise.query(
    `select paciente.id_paciente as idPaciente from paciente join persona on persona.id_persona = paciente.id_persona where persona.rut = ?`,
    [rut],
  );

  return rows[0];
};

export const registrarPersonaModel = async ({ idPersona, rut, dv, email, nombre, paterno, materno, idRol }) => {
  try {
    const [ResultSetHeader] = await promise.query(
      `
    INSERT INTO persona (id_persona, rut, dv, email, nombre, paterno, materno) VALUES (?, ?, ?, ?,?,?,?)`,
      [idPersona, rut, dv, email, nombre, paterno, materno],
    );
    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Surgió un error al registrar persona');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const registrarUsuarioModel = async ({ idUsuario, usuario, contrasena, idPersona, idRol }) => {
  try {
    const [ResultSetHeader] = await promise.query(
      `
      INSERT INTO usuario (id_usuario, usuario, contrasena, id_persona, id_rol) VALUES (?, ?, ?, ?, ?)
    `,
      [idUsuario, usuario, contrasena, idPersona, idRol],
    );

    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Surgió un error al registrar usuario');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const registrarDetallePersonaModel = async ({ idPersona }) => {
  try {
    const [ResultSetHeader] = await promise.query(`INSERT INTO detalle_persona (id_persona) VALUES (?)`, [idPersona]);

    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al registrar detalle persona');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const registrarTelefonoPersonaModel = async ({ idDetallePersona, telefono }) => {
  try {
    const [ResultSetHeader] = await promise.query(`INSERT INTO telefono_persona (id_detalle_persona, telefono) values(?,?)`, [
      idDetallePersona,
      telefono,
    ]);

    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al registrar telefono persona');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const registrarFichaMedicaModel = async ({ idFichaMedica }) => {
  try {
    const [ResultSetHeader] = await promise.query(`INSERT INTO ficha_medica (id_ficha_medica) VALUES (?)`, [idFichaMedica]);

    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al registrar ficha medica');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};

export const registrarPacienteModel = async ({ idPaciente, idPersona, idFichaMedica }) => {
  try {
    const [ResultSetHeader] = await promise.query(`INSERT INTO paciente (id_paciente, id_persona, id_ficha_medica) VALUES (?,?,?)`, [
      idPaciente,
      idPersona,
      idFichaMedica,
    ]);

    return ResultSetHeader;
  } catch (e) {
    const newError = new ErrorHandler('Se ha producido un error interno.');
    newError.setInternalMessage('Surgió un error al registrar paciente');
    newError.setDetailsError(e.message);
    newError.setStatus(500);
    throw newError;
  }
};
