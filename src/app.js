import { fetchData } from './fetchdata';
import chalk from 'chalk';
import { GraphQLServer } from 'graphql-yoga';

// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

/**
 * Main App
 * @param data all rickyandmorty database
 */
const runApp = data => {//TENEMOS QEU PONER LO OTRO DENTRO DE ESTO, PORQUE AL TENER QEU ACCEDER AL ARRAY Y NO A LA API, DESDE FUERA NO SABEMOS CUAL ES EL PARAMETRO DATA
  //Todos tienen que ser de tipo array y contener Character cada una de las posiciones del array
  const typeDefs = `

  type Query{
    character(id: Int!): Character!
    characters(page:Int,pageSize:Int,name:String,status:String,planet:String):[Character!]!
    planets:[String!]!
  }
  type Character{
    id: Int!
    name: String!
    status: String!
    planet: String!
  }
  `
  const resolvers ={ //ESte sería el handler
    Query:{
      character: (parent,args,ctx,info) => {
        
        const obj = data.find(c => c.id === args.id);

        return {
          id : obj.id,
          name: obj.name,
          status: obj.status,
          planet: obj.location.name

        }
      },
      characters: (parent,args,ctx,info) => {
        const page = args.page || 1;//También se podría hacer con ifs, pero es menos bonito
        const pageSize = args.pageSize || 20;

        const inicio = (page - 1) * pageSize;
        const fin = (inicio + pageSize);
        return data
          .filter(obj => obj.name.toUpperCase().includes(args.name.toUpperCase() || obj.name.toUpperCase() ))//como obj name = obj name es true, pues nos devuelve todos los objname(sin filtrar). Si coincide el nombre, nos devuelve solo los que tengan args.name
          .filter(obj => obj.status === (args.status || obj.status))//El que incluya el nombre que le pasamos o el mismo nombre. entonces o es todos o los filtrados
          .filter(obj => obj.planet === (args.planet || obj.planet))
          .slice(inicio,fin)
          .map(element=>{//Eliminamos los campos que no estan definidos en el tipo Character
            return{
              id: element.id,
              name: element.name,
              status: element.status,
              planet: element.location.name
            }
        })
      },
      planets: (parent,args,ctx,info)=>{
        let planetas = [];
        data.forEach(function(element){
          planetas.push(element.location.name);
        })
        planetas = [...new Set(planetas)];
        return planetas;
      }
    },
  }
  const server = new GraphQLServer({typeDefs,resolvers});
  server.start();//Para elegir el puerto seria ({port:3000})
};

// main program
fetchData(runApp, url);//runapp es el callback
