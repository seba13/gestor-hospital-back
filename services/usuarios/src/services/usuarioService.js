import { actualizarImagenUsuario, obtenerImagenUsuarioModel } from '../models/usuarioModel.js';

export default () => {
  return {
    actualizarImagenUsuario: async (idUsuario, imagen, mimetype) => {
      return await actualizarImagenUsuario(idUsuario, imagen, mimetype);
    },

    obtenerImagenUsuario: async (idUsuario) => {

        return await obtenerImagenUsuarioModel(idUsuario)

    }
  };
};
