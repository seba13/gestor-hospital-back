import { obtenerPersonaRut, obtenerPersonaEmail } from '../services/usuarioService.js';

export const validarPersonaRegistro = async (req, res, next) => {
  const { rut, email } = req.body;

  const rutPersona = await obtenerPersonaRut({ rut });
  const emailPersona = await obtenerPersonaEmail({ email });

  console.log({ rutPersona });
  console.log({ emailPersona });

  if (rutPersona || emailPersona) {
    return res.status(400).json({
      response: false,
      message: 'email o rut ya registrado',
    });
  }

  next();
};

export const validarRut = async (req, res, next) => {
  const { rut } = req.body;
  const rutPersona = await obtenerPersonaRut({ rut });

  console.log({ rut });

  if (!rutPersona) {
    return res.status(400).json({
      response: false,
      message: 'persona no registrada',
    });
  }

  return next();
};

export const validarEmail = async (req, res, next) => {
  const { rut, email } = req.body;
  const rutPersona = await obtenerPersonaRut({ rut });

  console.log({ rutPersona });

  if (!rutPersona || rutPersona.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(400).json({
      response: false,
      message: 'email no coincide con email usuario',
    });
  }

  return next();
};
