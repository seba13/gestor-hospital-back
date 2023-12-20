import { fetchPersonaRegistrada, fetchValidarEmailPersona, fetchRegistrarUsuario } from '../utils/fetchValidateUser.js';

export const validateUser = async (req, res, next) => {
  console.log('MIDDLWARE VALIDAR USUARIO');

  const { rut, dv, idMedico, hora, fecha, email, duracionCita, nombre, paterno, materno, telefono, idRol } = req.body;

  const fetchValidarRut = await fetchPersonaRegistrada({ rut });

  if (fetchValidarRut.response) {
    const fetchValidarEmail = await fetchValidarEmailPersona({ rut, email });

    // validar email
    if (fetchValidarEmail.response) {

        console.log("EMAIL Y RUT VALIDOS");

      // agendar cita
      return next();
    } else {

        console.log("EMAIL Y RUT NO COINCIDEN");

      return res.status(fetchValidarEmail.status || 400).json({ response: false, message: fetchValidarEmail.message });
    }
  } else {
    const fetchRegistroUsuario = await fetchRegistrarUsuario({
      rut,
      dv,
      idMedico,
      hora,
      fecha,
      email,
      duracionCita,
      nombre,
      paterno,
      materno,
      telefono,
      idRol,
    });

    if (fetchRegistroUsuario.response) {

        console.log("USUARIO REGISTRADO");

      // agendar cita
      return next();
    }

    return res.status(fetchRegistroUsuario.status || 400).json({ response: false, message: fetchRegistroUsuario.message });
  }
};
