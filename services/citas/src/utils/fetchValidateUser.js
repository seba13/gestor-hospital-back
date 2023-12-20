import config from '../../../../config/config.js';

const { dominio, portUsuarios } = config;

export const fetchPersonaRegistrada = async ({ rut }) => {
  const fetchPersona = await fetch(`${dominio}:${portUsuarios}/persona-registrada`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ rut }),
  });

  return { ...(await fetchPersona.json()), status: fetchPersona.status };
};

export const fetchValidarEmailPersona = async ({ rut, email }) => {
  const fetchValidarEmail = await fetch(`${dominio}:${portUsuarios}/validar-email`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ rut, email }),
  });

  return { ...(await fetchValidarEmail.json()), status: fetchValidarEmail.status };
};

export const fetchRegistrarUsuario = async ({ rut, dv, email, nombre, paterno, materno, idRol, telefono }) => {
  const fetchRegistrarUsuario = await fetch(`${dominio}:${portUsuarios}/registrar-usuario`, {
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
  const fetchIdPaciente = await fetch(`${dominio}:${portUsuarios}/usuario/obtener-idpaciente`, {
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
