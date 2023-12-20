import {
  actualizarImagenUsuarioModel,
  obtenerImagenUsuarioModel,
  obtenerPersonaRutModel,
  registrarPersonaModel,
  obtenerPersonaEmailModel,
  registrarUsuarioModel,
  registrarDetallePersonaModel,
  registrarTelefonoPersonaModel,
  registrarFichaMedicaModel,
  registrarPacienteModel,
  iniciarTransaccion,
  guardarTransaccion,
  devolverTransaccion,
  obtenerIdPacienteRut,
} from '../models/usuarioModel.js';
import { v4 as uuidv4 } from 'uuid';
// import { pool } from '../../../../config/db.js';

export const actualizarImagenUsuario = async (idUsuario, imagen, mimetype) => {
  return await actualizarImagenUsuarioModel(idUsuario, imagen, mimetype);
};

export const obtenerImagenUsuario = async idUsuario => {
  return await obtenerImagenUsuarioModel(idUsuario);
};

export const registrarPersona = async ({ rut, dv, email, nombre, paterno, materno, idRol, telefono }) => {
  const idPersona = uuidv4();
  const idFichaMedica = uuidv4();

  try {
    await iniciarTransaccion();

    const resultRegistroPersona = await registrarPersonaModel({ idPersona, rut, dv, email, nombre, paterno, materno });

    const resultRegistroUsuario = await registrarUsuario({ usuario: email, rut, idPersona, idRol });

    const resultRegistroDetallePersona = await registrarDetallePersona({ idPersona });

    const resultRegistrarTelefonoPersona = await registrarTelefonoPersona({ idDetallePersona: resultRegistroDetallePersona.insertId, telefono });

    const resultRegistrarFichaMedica = await registrarFichaMedica({ idFichaMedica });

    const resultRegistrarPaciente = await registrarPaciente({ idPersona, idFichaMedica });

    if (
      resultRegistroPersona.affectedRows &&
      resultRegistrarFichaMedica.affectedRows &&
      resultRegistroUsuario.affectedRows &&
      resultRegistroDetallePersona.affectedRows &&
      resultRegistrarTelefonoPersona.affectedRows &&
      resultRegistrarFichaMedica.affectedRows &&
      resultRegistrarPaciente.affectedRows
    )
      await guardarTransaccion();
    return { response: true, message: 'Persona registrada con éxito' };
  } catch (e) {
    console.log('Rollback');
    await devolverTransaccion();
    throw e;
  }
};

export const registrarUsuario = async ({ usuario, rut, idPersona, idRol = 4 }) => {
  console.log({ usuario, rut, idPersona, idRol });

  const idUsuario = uuidv4();
  const contrasena = rut.slice(0, 4);

  return await registrarUsuarioModel({ idUsuario, usuario, contrasena, idPersona, idRol });
};

export const registrarDetallePersona = async ({ idPersona }) => {
  return await registrarDetallePersonaModel({ idPersona });
};
export const registrarTelefonoPersona = async ({ idDetallePersona, telefono }) => {
  console.log({ idDetallePersona, telefono });

  return await registrarTelefonoPersonaModel({ idDetallePersona, telefono });
};
export const registrarFichaMedica = async ({ idFichaMedica }) => {
  return await registrarFichaMedicaModel({ idFichaMedica });
};
export const registrarPaciente = async ({ idPersona, idFichaMedica }) => {
  const idPaciente = uuidv4();

  return await registrarPacienteModel({ idPaciente, idPersona, idFichaMedica });
};

export const obtenerPersonaRut = async ({ rut }) => {
  return await obtenerPersonaRutModel({ rut });
};

export const obtenerPersonaEmail = async ({ email }) => {
  return await obtenerPersonaEmailModel({ email });
};

export const obteneridPacienteRut = async ({ rut }) => {
  return await obtenerIdPacienteRut({ rut });
};
