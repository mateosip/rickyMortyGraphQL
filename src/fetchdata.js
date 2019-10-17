import request from 'request';
import chalk from 'chalk';
import fs from 'fs';


const fetchData = (callback, url, data) => {
  const path = "./fichero2.json";
  fs.access(path, fs.F_OK, (err)=>{
    if (err){ //ESto se podría hacer con un try catch, sin comprobar si existe el archivo. Intentamos leer y si no da pues la otra opción la metemos dentro del catch
      if (!data) data = [];
      console.log(chalk.bold.underline.blue('fechting data...'));
      request({ url, json: true }, (error, response) => {
        if (response.body) {
          data = [...data, ...response.body.results];//data = data + todo el contenido de response.body.results
        }
        if (response.body.info.next !== '')
          fetchData(callback, response.body.info.next, data);
        else {
          fs.writeFileSync("fichero2.json",JSON.stringify(data));
          callback(data);
        }
      },
      );
      //en este caso guardamos en el fichero lo de la api(lo pasamos como array json.)
    }
    else{
      if (!data) data = [];
      data = JSON.parse(fs.readFileSync("fichero2.json").toString());
      callback(data);
      //SI ya exxiste el fichero, data va a ser el contenido de dicho fichero.
    }
    
  })
};

export { fetchData };