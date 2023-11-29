import fetch from "node-fetch";

const services = () => {
  return {
    microservice1: (req, res) => {
  
      fetch("http://localhost:81/")
        .then((result) => result.json())
        .then((json) => {
            console.log(json);


            res.send(json.data)

        })
        .catch(e=>{
            console.log(e);
        })
    },
  };
};

export default services;
