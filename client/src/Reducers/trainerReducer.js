import { v4 } from "uuid";

const initialState = [
  {
    id: v4(),
    name: "EVEN",
    pokemons: [1, 2, 3, 4, 5],
  },
];

let newState = null;
let index = 0;
let pokemonIdx = 0;

const trainerReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "ADD_TRAINER":
      console.log("ADD_TRAINER");
      return [...state, { id: v4(), name: payload.name, pokemons: [] }];
    case "DELETE_TRAINER":
      console.log("DELETE_TRAINER");
      newState = [...state];
      index = newState.findIndex((x) => x.id === payload.id);
      newState.splice(index, 1);
      return [...newState];

    case "ADD_A_POKEMON":
      console.log("ADD_POKEMON");
      console.log(`newState: ${newState}`);
      newState = [...state];
      index = newState.findIndex((x) => x.id === payload.userId);
      newState[index].pokemons.push(parseInt(payload.pokemonId));
      return [...newState];

    case "DEL_POKEMON":
      console.log("DEL_POKEMON");
      //   console.log(`state: ${state}`);

      newState = [...state];
      //   console.log(`newState: ${newState}`);
      index = newState.findIndex((x) => x.id === payload.userId);
      console.log(`index: ${index}`);
      console.log(`payload: ${JSON.stringify(payload)}`);
      pokemonIdx = newState[index].pokemons.findIndex(
        (x) => x === parseInt(payload.pokemonId)
      );
      console.log(`pokemonIdx${pokemonIdx}`);
      newState[index].pokemons.splice(pokemonIdx, 1);
      return [...newState];

    default:
      return state;
  }
};

export default trainerReducer;
