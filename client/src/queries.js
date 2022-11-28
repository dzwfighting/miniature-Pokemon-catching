import { gql } from "@apollo/client";

const POKEMONS = gql`
  query AllPokemon($pageNum: Int!) {
    allPokemon(pageNum: $pageNum) {
      pokemonId
      name
      abilities
      moves
      species
      sprites {
        official
        back
        front
        back_shiny
        front_shiny
      }
      trainer
    }
  }
`;

const POKEMON = gql`
  query GetPokemon($pokemonId: ID!) {
    getPokemon(pokemonId: $pokemonId) {
      pokemonId
      name
      abilities
      moves
      species
      sprites {
        official
        back
        front
        back_shiny
        front_shiny
      }
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
        sprites {
          official
          back
          front
          back_shiny
          front_shiny
        }
        trainer
      }
    }
  }
`;

const TRAINER = gql`
  query GetTrainer($trainerId: ID!) {
    getTrainer(trainerId: $trainerId) {
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites {
          official
          back
          front
          back_shiny
          front_shiny
        }
        trainer
      }
    }
  }
`;

const UPLOAD_TRAINER = gql`
  mutation UploadTrainer($name: String!) {
    uploadTrainer(name: $name) {
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites {
          official
          back
          front
          back_shiny
          front_shiny
        }
        trainer
      }
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
        sprites {
          official
          back
          front
          back_shiny
          front_shiny
        }
        trainer
      }
    }
  }
`;

const DELPOKEMON = gql`
  mutation DeletePokemon($pokemonId: ID!, $trainerId: ID!) {
    deletePokemon(pokemonId: $pokemonId, trainerId: $trainerId) {
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites {
          official
          back
          front
          back_shiny
          front_shiny
        }
        trainer
      }
    }
  }
`;

const DELETE_TRAINER = gql`
  mutation deleteTrainer($trainerId: ID!) {
    deletetrainer(trainerId: $trainerId) {
      trainerId
      name
      pokemons {
        pokemonId
        name
        abilities
        moves
        species
        sprites {
          official
          back
          front
          back_shiny
          front_shiny
        }
        trainer
      }
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
