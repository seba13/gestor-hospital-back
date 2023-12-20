import ErrorHandler from '../../../usuarios/src/errorHandler/errorHandler.js';

export const stringHoraToDate = stringHora => {
  const fecha = new Date();

  if (stringHora.split(':').length !== 2) {
    const newError = new ErrorHandler('hora inválida');
    newError.setStatus(500);

    throw newError;
  }
  return new Date(fecha.getFullYear() + '-' + (+fecha.getMonth() + 1) + '-' + (+fecha.getDate() + 1) + 'T' + stringHora);
};
