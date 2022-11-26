import { gql } from "@apollo/client";

const POKEMONS = gql`
  query AllPokemon($pageNum: Int!) {
    allPokemon(pageNum: $pageNum) {
      pokemonId
      name
      abilities
      moves
      species
      sprites
      trainer
    }
  }
`;

const POKEMON = gql`
  query GetPokemonById($pokemonId: ID!) {
    getPokemonById(pokemonId: $pokemonId) {
      pokemonId
      name
      abilities
      moves
      species
      sprites
      trainer
    }
  }
`;

const TRAINERS = gql`
  query {
    allTrainer {
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites
        trainer
      }
    }
  }
`;

const TRAINER = gql`
  query GetTrainerById($trainerId: ID!) {
    getTrainerById(trainerId: $trainerId) {
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites
        trainer
      }
    }
  }
`;

const UPLOAD_TRAINER = gql`
  mutation UploadTrainer($name: String!) {
    uploadTrainer(name: $name) {
      name
    }
  }
`;

const ADDPOKEMON = gql`
  mutation AddPokemon($pokemonId: ID!, $trainerId: ID!) {
    addPokemon(pokemonId: $pokemonId, trainerId: $trainerId) {
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites
        trainer
      }
    }
  }
`;

const DELPOKEMON = gql`
  mutation DelPokemon($pokemonId: ID!, $trainerId: ID!){
    delPokemon($pokemonId: ID!, $trainerId: ID!){
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites
        trainer
      }
    }
  }
`;

const DELETE_TRAINER = gql`
  mutation deleteTrainer($trainerId: ID!) {
    deletetrainer(trainerId: $trainerId) {
      trainerId
    }
  }
`;

export default {
  POKEMONS,
  POKEMON,
  TRAINERS,
  TRAINER,
  UPLOAD_TRAINER,
  ADDPOKEMON,
  DELPOKEMON,
  DELETE_TRAINER,
};
