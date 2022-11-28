import React from "react";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import context from "../context";
import axios from "axios";
import actions from "../actions";

import noImage from "../img/download.jpeg";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import PokemonDetail from "./PokemonDetail";
import { Button } from "@material-ui/core";

const TrainerDetail = (props) => {
  const [Trainer, setTrainer] = useContext(context);
  const [pokemons, setPokemons] = useState([]);
  const [showDelButton, setShowDelButton] = useState(true);
  const [showSelect, setShowSelect] = useState(true);
  const [loading, setLoading] = useState(false);

  let card = null;

  const allTrainers = useSelector((state) => state.trainer);
  console.log(`AllTrainers: ${JSON.stringify(allTrainers)}`);
  const dispatch = useDispatch();
  console.log(`props: ${JSON.stringify(props)}`);
  console.log(
    `props.trainer.pokemons.length: ${props.trainer.pokemons.length}`
  );

  // for (let i = 0; i < props.trainer.pokemons.length; i++) {
  //   tempPokemon = props.trainer.pokemons[i];
  //   let {
  //     loading: pokemonLoading,
  //     error: pokemonError,
  //     data: pokemonData,
  //   } = useQuery(queries.POKEMON, {
  //     fetchPolicy: "cache-and-network",
  //     variables: {
  //       pokemoId: tempPokemon,
  //     },
  //   });
  //   allPokemons.push(pokemonData);

  //   console.log(pokemonLoading, pokemonData);
  // }

  // const buildCard = (data) => {
  //   return (
  //     <Grid item xs={6} sm={6} md={6} lg={6} xl={6} key={data}>
  //       <Card className={classes.card} variant="outlined">
  //         <CardActionArea>
  //           <Link to={`/pokemon/${data}`}>
  //             <CardContent>
  //               <Typography
  //                 className={classes.titleHead}
  //                 gutterBottom
  //                 variant="h6"
  //                 component="h3"
  //               >
  //                 {data.name}
  //               </Typography>
  //               <Typography variant="body2" color="textSecondary" component="p">
  //                 {data.species
  //                   ? `Species: ${data.species}`
  //                   : "Species: Anonymous"}
  //               </Typography>
  //               <Typography variant="body2" color="textSecondary" component="p">
  //                 {data.trainer ? `Trainer: ${data.trainer}` : "Trainer: No"}
  //               </Typography>
  //             </CardContent>
  //           </Link>
  //         </CardActionArea>
  //       </Card>
  //     </Grid>
  //   );
  // };

  card =
    props.trainer &&
    props.trainer.pokemons.map((pokemon) => {
      return <PokemonDetail pokemon={pokemon}></PokemonDetail>;
    });

  const selectTrainer = (e) => {
    e.preventDefault();
    setShowSelect(!showSelect);
    setShowDelButton(!showSelect);
    setTrainer(props.trainer);
  };
  console.log(showSelect, showDelButton);

  const deleteTrainer = () => {
    if (Trainer.id === props.trainer.id) {
      if (allTrainers[0].id === props.trainer.id) {
        console.log("Trainer.id === props.trainer.id");
        setShowDelButton(false);
      } else {
        console.log("Trainer.id !== props.trainer.id");
        setShowDelButton(true);
        dispatch(actions.deleteTrainer(props.trainer.id));
        setTrainer(allTrainers[1]);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (props.trainer.pokemons.length === 0) {
    return (
      <h3>
        <br />
        <br />
        {props.trainer.name}
        <br />
        <div>
          {showSelect ? (
            <Button onClick={selectTrainer}>Select As Current Trainer </Button>
          ) : (
            <Button onClick={selectTrainer}>UnSelect</Button>
          )}
          {showDelButton ? (
            <Button onClick={deleteTrainer}>Delete This Trainer</Button>
          ) : (
            <div></div>
          )}
        </div>
        <br />
        <br />
      </h3>
    );
  } else {
    return (
      <div>
        <h3>{props.trainer.name}</h3>
        <div>
          {showSelect ? (
            <Button onClick={selectTrainer}>Select As Current Trainer </Button>
          ) : (
            <Button onClick={selectTrainer}>UnSelect</Button>
          )}
          {showDelButton ? (
            <Button onClick={deleteTrainer}>Delete This Trainer</Button>
          ) : (
            <div></div>
          )}
        </div>

        {card}
        <br />
        <br />
      </div>
    );
  }
};

export default TrainerDetail;
