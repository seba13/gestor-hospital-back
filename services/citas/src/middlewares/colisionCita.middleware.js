import { colisionCita } from '../service/citaService.js';

export const validarCita = async (req, res, next) => {
  const { fecha, idMedico, duracionCita, hora } = req.body;

  const colision = await colisionCita({ fechaCitas: fecha, idMedico, hora, duracionCita });

console.log("MIDDLEWARE VALIDAR CITA");


  if (colision.response) {
    return res.status(400).json({
      response: false,
      message: colision.message || 'Error al agendar cita',
    });
  }
  return next();
};
