import { setCitaMedica, getCitas } from '../models/citaModel.js';

export default () => {
  return {
    getCitas: async () => await getCitas(),
    setCita: async (params) => await setCitaMedica(params),
  };
};
