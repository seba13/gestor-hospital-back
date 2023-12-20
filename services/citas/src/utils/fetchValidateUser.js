import config from '../config/config.js';

const { urlUsuarios } = config;

export const fetchPersonaRegistrada = async ({ rut }) => {
  const fetchPersona = await fetch(`${urlUsuarios}/persona-registrada`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ rut }),
  });

  return { ...(await fetchPersona.json()), status: fetchPersona.status };
};

export const fetchValidarEmailPersona = async ({ rut, email }) => {
  const fetchValidarEmail = await fetch(`${urlUsuarios}/validar-email`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ rut, email }),
  });

  return { ...(await fetchValidarEmail.json()), status: fetchValidarEmail.status };
};

export const fetchRegistrarUsuario = async ({ rut, dv, email, nombre, paterno, materno, idRol, telefono }) => {
  const fetchRegistrarUsuario = await fetch(`${urlUsuarios}/registrar-usuario`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ rut, dv, email, nombre, paterno, materno, idRol, telefono }),
  });

  const json = await fetchRegistrarUsuario.json();

  // const response = fetchRegistrarUsuario.ok;

  return { ...json, status: fetchRegistrarUsuario.status };
};

export const fetchObtenerIdPacienteRut = async ({ rut }) => {
  const fetchIdPaciente = await fetch(`${urlUsuarios}/usuario/obtener-idpaciente`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ rut }),
  });

  const json = await fetchIdPaciente.json();

  console.log('fetch id paciente rut');
  console.log({ rut });

  console.log({ ...json });

  return { ...json, status: fetchIdPaciente.status };
};
