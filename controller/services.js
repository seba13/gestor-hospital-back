import fetch from 'node-fetch';

const services = () => {
  return {
    getEspecialidades: (req, res) => {
      fetch('http://localhost:81/medicos/especialidades')
        .then(result => result.json())
        .then(json => {
          console.log(json);

          res.send(json);
        })
        .catch(e => {
          console.log(e);
        });
    },
  };
};

export default services;
