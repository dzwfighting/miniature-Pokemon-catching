const addTrainer = (name) => ({
  type: "ADD_TRAINER",
  payload: {
    name: name,
  },
});

const deleteTrainer = (id) => ({
  type: "DELETE_TRAINER",
  payload: {
    id: id,
  },
});

const addPokemon = (userId, pokemonId) => ({
  type: "ADD_A_POKEMON",
  payload: {
    userId: userId,
    pokemonId: pokemonId,
  },
});

const deletePokemon = (userId, pokemonId) => ({
  type: "DEL_POKEMON",
  payload: {
    userId: userId,
    pokemonId: pokemonId,
  },
});

module.exports = {
  addTrainer,
  deleteTrainer,
  addPokemon,
  deletePokemon,
};
