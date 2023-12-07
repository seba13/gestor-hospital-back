import { actualizarImagenUsuario } from '../models/usuarioModel.js';

export default () => {
  return {
    actualizarImagenUsuario: async (idUsuario, imagen, mimetype) => {
      return await actualizarImagenUsuario(idUsuario, imagen, mimetype);
    },
  };
};
