const express = require("express");
const { ApolloServer, gql } = require("apollo-server");

const redis = require("redis");
const axios = require("axios");
const uuid = require("uuid");
const bluebird = require("bluebird");
const { application } = require("express");
const client = redis.createClient();

//  convert regular API to the API which promise can read
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function (err) {
  console.error("Oh, something wrong when connect to redis", err);
  process.exit();
});

// async function testAll() {
//   var curpage = 2;
//   var offset = curpage * 20;

//   const { data } = await axios.get(
//     `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`
//   );
//   console.log(data);
// }
// async function getOne() {
//   const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/3`);
//   console.log(data);
// }

// console.log(testAll());
// console.log(getOne());

const typeDefs = gql`
  type Query {
    allPokemon(pageNum: Int): [pokemon]
    getPokemon(pokemonId: ID!): pokemon
    allTrainer: [trainer]
  }

  type pokemon {
    pokemonId: ID!
    name: String!
    abilities: [String]
    moves: [String]
    species: String!
    sprites: sprit!
    trainer: String
  }

  type ability {
    name: [String]
  }

  type move {
    name: [String]
  }

  type sprit {
    official: String!
    back: String!
    front: String!
    back_shiny: String!
    front_shiny: String!
  }

  type trainer {
    trainerId: ID!
    name: String!
    pokemons: [pokemon]
  }

  type Mutation {
    uploadTrainer(name: String!): trainer

    addPokemon(pokemonId: ID!, trainerId: ID!): trainer

    deletePokemon(pokemonId: ID!, trainerId: ID!): trainer

    deleteTrainer(trainerId: ID!): trainer
  }
`;

const resolvers = {
  Query: {
    allPokemon: async (_, args) => {
      try {
        var curPage = parseInt(args.pageNum);
        console.log(`curPage: ${curPage}`);
        if (curPage < 0) {
          throw Error("Please input an valid page number");
        }
        var offset = curPage * 20;
        console.log(`offset: ${offset}`);
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`
        );

        if (data.results && data.results.length === 0) {
          throw Error("This page is not exist, please try again");
        }

        // console.log(data);
        let pokemonList = [];
        // console.log(`exact data results: ${data["results"]}`);
        // console.log(typeof data["results"]);
        for (let key in data["results"]) {
          let abilityList = [];
          let moveList = [];

          let trainer = "";
          single = data["results"][key];
          // console.log(`single pokemon data is: ${JSON.stringify(single)}`);
          let pokemonURL = single.url;
          // console.log(
          //   `single pokemonurl: ${pokemonURL}, the type is: ${typeof pokemonURL}`
          // );
          let pokemonDetail = {};
          pokemonDetail = (await axios.get(pokemonURL)).data;
          // console.log(
          //   `typeof (await axios.get(pokemonURL)): ${typeof (await axios.get(
          //     pokemonURL
          //   ))}`
          // );
          // console.log((await axios.get(pokemonURL)).data);
          // pokemonDetail = pokemonDetail["data"];
          // console.log(`the pokemonDetail data is ${pokemonDetail}`);
          // console.log(pokemonDetail["sprites"]);

          console.log(
            `pokemonDetail.abilities.length: ${pokemonDetail.abilities.length}`
          );
          for (let abi = 0; abi < pokemonDetail.abilities.length; abi += 1) {
            // console.log(
            //   `pokemonDetail.abilities[abi]: ${JSON.stringify(
            //     pokemonDetail.abilities[abi]
            //   )}`
            // );
            // console.log(
            //   `pokemonDetail.abilities[abi].name: ${pokemonDetail.abilities[abi].ability.name}`
            // );
            // console.log(pokemonDetail.abilities[abi].ability);
            abilityList.push(
              pokemonDetail.abilities[abi].ability.name
                ? pokemonDetail.abilities[abi].ability.name
                : "N/A"
            );
          }

          console.log(
            `pokemonDetail.moves.length: ${pokemonDetail.moves.length}`
          );
          for (let mov = 0; mov < pokemonDetail.moves.length; mov += 1) {
            moveList.push(
              pokemonDetail.moves[mov].move.name
                ? pokemonDetail.moves[mov].move.name
                : "N/A"
            );
          }

          // console.log(`sprites: ${pokemonDetail["sprites"]}`);
          const spritList = {
            official: pokemonDetail.sprites.other.dream_world.front_default,
            back: pokemonDetail.sprites.back_default,
            front: pokemonDetail.sprites.front_default,
            back_shiny: pokemonDetail.sprites.back_shiny,
            front_shiny: pokemonDetail.sprites.front_shiny,
          };

          let trainers = await client
            .lrangeAsync("trainers", 0, -1)
            .map(JSON.parse);

          // console.log(trainers);

          let pokemon = {
            pokemonId: pokemonDetail.id,
            name: pokemonDetail.name,
            abilities: abilityList,
            moves: moveList,
            species: pokemonDetail.species.name,
            sprites: spritList,
            trainer: "",
          };

          let temp = "";
          for (let t in trainers) {
            for (let p in t.pokemons) {
              if (p.pokemonId === pokemon.pokemonId) {
                temp = t.name;
                break;
              }
            }
            if (temp) {
              break;
            }
          }
          if (temp) {
            pokemon[trainer] = temp;
          }

          await client.lpushAsync(
            `${pokemon.pokemonId}`,
            JSON.stringify(pokemon)
          );
          // console.log(pokemon.pokemonId);
          // await client.lpushAsync(`${offset}`, JSON.stringify(pokemon));
          pokemonList.push(pokemon);
          // return pokemon;
        }

        // const allPokemonData = await client
        //   .lrangeAsync(`${offset}`, 0, -1)
        //   .map(JSON.parse);
        // console.log(allPokemonData);
        // return JSON.parse(await client.lrangeAsync(`${offset}`, 0, 19));
        // console.log(pokemonList);
        return pokemonList;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    getPokemon: async (_, args) => {
      try {
        if (!args.pokemonId) {
          throw Error("Please input a id to search the pokemon");
        }

        args.pokemonId = parseInt(args.pokemonId);
        let findPokemon = await client.exists(`${args.pokemonId}`);
        console.log(findPokemon);
        if (findPokemon) {
          console.log("this id in the redis");
          let cache = await client
            .lrangeAsync(`${args.pokemonId}`, 0, -1)
            .map(JSON.parse);
          // console.log(cache[0]);
          return cache[0];
        } else {
          let data = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${args.pokemonId}`
          );
          data = data.data;
          console.log(data);
          if (data.length === 0) {
            throw Error("The pokemon we cannot find, please try again");
          }

          let abilityList = [];
          let moveList = [];
          let spritList = {
            official: data.sprites.other.dream_world.front_default,
            back: data.sprites.back_default,
            front: data.sprites.front_default,
            back_shiny: data.sprites.back_shiny,
            front_shiny: data.sprites.front_shiny,
          };

          console.log(`data.abilities.length: ${data.abilities.length}`);
          for (let abi = 0; abi < data.abilities.length; abi += 1) {
            if (data.abilities[abi].ability) {
              abilityList.push(
                data.abilities[abi].ability.name
                  ? data.abilities[abi].ability.name
                  : "N/A"
              );
            } else {
              abilityList.push("N/A");
            }
          }

          console.log(`data.moves.length${data.moves.length}`);
          for (let mov = 0; mov < data.moves.length; mov += 1) {
            moveList.push(
              data.moves[mov].move.name ? data.moves[mov].move.name : "N/A"
            );
          }
          // console.log(`abilityList: ${abilityList}`);
          // console.log(`moveList: ${moveList}`);

          let pokemon = {
            pokemonId: args.pokemonId,
            name: data.name,
            abilities: abilityList,
            moves: moveList,
            species: data.species.name,
            sprites: spritList,
            trainer: "",
          };

          let trainers = await client
            .lrangeAsync("trainers", 0, -1)
            .map(JSON.parse);

          // console.log(`not in cache, try get trainers to find ${trainers}`);

          let temp = "";
          for (let t in trainers) {
            for (let p in t.pokemons) {
              if (p.pokemonId === pokemon.pokemonId) {
                temp = t.name;
                break;
              }
            }
            if (temp) {
              break;
            }
          }
          pokemon.trainer = temp;
          // pokemon[trainer] = temp;

          await client.lpushAsync(`${args.pokemonId}`, JSON.stringify(pokemon));

          // console.log(pokemon);

          return pokemon;
        }
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    allTrainer: async () => {
      try {
        let trainers = await client
          .lrangeAsync("trainers", 0, -1)
          .map(JSON.parse);
        return trainers;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },
  },

  Mutation: {
    uploadTrainer: async (_, args) => {
      try {
        if (!args.name) {
          throw Error("Please input a trainer name");
        }
        const trainer = {
          trainerId: uuid.v4(),
          name: args.name,
          pokemons: [],
        };

        // console.log(
        //   `Array.isArray(trainer.pokemons): ${Array.isArray(trainer.pokemons)}`
        // );

        // convert obj to JSON
        await client.setAsync(trainer.trainerId, JSON.stringify(trainer));
        await client.lpushAsync("trainers", JSON.stringify(trainer));

        console.log(trainer);
        return trainer;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    addPokemon: async (_, args) => {
      try {
        if (!args.trainerId) {
          throw Error("We can not find the trainer id, please try again");
        }
        if (!args.pokemonId) {
          throw Error("Cannot find the pokemon id, please try again");
        }

        console.log(args.trainerId);
        let trainer = JSON.parse(await client.getAsync(args.trainerId));
        // console.log(`update cache:${JSON.stringify(trainer)}`);
        if (!trainer) {
          throw Error("this trainer is not exist, please try again");
        }
        if (trainer.pokemons.length === 6) {
          throw Error(
            "One trainer only can have 6 pokemons, this trainer cannot add again!"
          );
        }

        let pokemon = await client
          .lrangeAsync(args.pokemonId, 0, -1)
          .map(JSON.parse);
        if (!pokemon) {
          console.log(`this pokemon already in redis`);
          let pokemon = await client
            .lrangeAsync(args.pokemonId, 0, -1)
            .map(JSON.parse);

          pokemon = pokemon[0];
          // console.log(`this pokemon exist: ${JSON.stringify(pokemon)}`);

          const newPokemon = {
            pokemonId: pokemon.pokemonId,
            name: pokemon.name,
            abilities: pokemon.abilities,
            moves: pokemon.moves,
            species: pokemon.species,
            sprites: pokemon.sprites,
            trainer: trainer.name,
          };

          await client.delAsync(args.pokemonId);
          await client.lpushAsync(
            `${args.pokemonId}`,
            JSON.stringify(newPokemon)
          );
          console.log(`update this pokemon: ${JSON.stringify(newPokemon)}`);
          // console.log(trainer.pokemons instanceof Array);

          // console.log(Array.isArray(trainer.pokemons));
          // console.log(trainer["pokemons"].length);
          // console.log(`trainer.pokemons: ${trainer["pokemons"]}`);
          trainer["pokemons"].push(newPokemon);
          console.log(JSON.stringify(trainer));
          // temp = trainer["pokemons"].push(pokemon);
          // console.log(temp);
          let newTrainer = trainer;
          console.log(`newTrainer: ${JSON.stringify(newTrainer)}`);

          await client.delAsync(args.trainerId);
          await client.lremAsync("trainers", 0, JSON.stringify(trainer));
          await client.lpushAsync("trainers", 0, JSON.stringify(newTrainer));
          await client.setAsync(args.trainerId, JSON.stringify(newTrainer));

          return newTrainer;
        } else {
          let data = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${args.pokemonId}`
          );
          data = data.data;
          // console.log(data);
          if (data.length === 0) {
            throw Error("The pokemon we cannot find, please try again");
          }

          let abilityList = [];
          let moveList = [];
          let spritList = {
            official: data.sprites.other.dream_world.front_default,
            back: data.sprites.back_default,
            front: data.sprites.front_default,
            back_shiny: data.sprites.back_shiny,
            front_shiny: data.sprites.front_shiny,
          };

          for (let abi = 0; abi < data.abilities.length; abi += 1) {
            if (data.abilities[abi].ability) {
              abilityList.push(
                data.abilities[abi].ability.name
                  ? data.abilities[abi].ability.name
                  : "N/A"
              );
            } else {
              abilityList.push("N/A");
            }
          }

          for (let mov = 0; mov < data.moves.length; mov += 1) {
            moveList.push(
              data.moves[mov].move.name ? data.moves[mov].move.name : "N/A"
            );
          }

          const pokemon = {
            pokemonId: args.pokemonId,
            name: data.name,
            abilities: abilityList,
            moves: moveList,
            species: data.species.name,
            sprites: spritList,
            trainer: trainer.name,
          };
          await client.lpushAsync(`${args.pokemonId}`, JSON.stringify(pokemon));

          trainer["pokemons"].push(pokemon);
          const newTrainer = trainer;

          await client.delAsync(args.trainerId);
          await client.lremAsync("trainers", 0, JSON.stringify(trainer));
          await client.lpushAsync("trainers", JSON.stringify(newTrainer));
          await client.setAsync(args.trainerId, JSON.stringify(newTrainer));

          console.log(
            `pokemon not in redis, and the new trainer is: ${JSON.stringify(
              newTrainer
            )}`
          );
          return newTrainer;
        }
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    deleteTrainer: async (_, args) => {
      try {
        if (!args.trainerId) {
          throw Error("We can not find id, please try again");
        }

        const trainer = JSON.parse(await client.getAsync(args.trainerId));
        console.log(`update cache:${cache}`);

        if (!trainer) {
          throw Error("this trainer is not exist, please try again");
        }

        const delPokemon = JSON.parse(await client.getAsync(args.pokemonId));

        for (let po = 0; po < trainer.pokemons.length; po += 1) {
          if (trainer.pokemons[po].pokemonId === delPokemon.pokemonId) {
            arr.splice(po, 1);
          }
        }

        console.log(`del a pokemon ${trainer}`);
        await client.setAsync(args.trainerId, JSON.stringify(trainer));

        return trainer;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },

    deleteTrainer: async (_, args) => {
      try {
        if (!args.trainerId) {
          throw Error("Please input an id to delete");
        }
        // JSON.parse: convert json to string
        const trainer = JSON.parse(await client.getAsync(args.trainerId));
        console.log(`del trainer ${trainer}`);

        await client.lremAsynv("trainers", 0, JSON.stringify(trainer));
        await client.delAsync(args.trainerId);
        return trainer;
      } catch (error) {
        console.log(error.message);
        throw Error(error.message);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
