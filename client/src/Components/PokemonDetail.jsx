import React from "react";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import actions from "../actions";

import noImage from "../img/download.jpeg";
import Error from "./Error";

import "bootstrap/dist/css/bootstrap.min.css";
import "../style/pokemonDetail.css";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import context from "../context";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  card: {
    maxWidth: 700,
    width: 500,
    height: "auto",
    marginLeft: 350,
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 14,
    paddingBottom: 15,
  },
});

const PokemonDetail = (props) => {
  const classes = useStyles();
  const [Trainer] = useContext(context);

  let pokemonId = parseInt(useParams().id);
  console.log(pokemonId);
  let card = null;
  let trainerCard = null;

  let trainerProps = parseInt(props.pokemon) ? parseInt(props.pokemon) : 1;
  console.log(props);
  console.log(`Trainer: ${JSON.stringify(Trainer)}`);

  const { loading, error, data } = useQuery(queries.POKEMON, {
    fetchPolicy: "cache-and-network",
    variables: {
      pokemonId: pokemonId,
    },
  });

  console.log(loading, error, data);

  if (data) {
    console.log(`data.getPokemon.pokemonId: ${data.getPokemon.pokemonId}`);

    console.log(
      `check if the pokemon in trainer: ${Trainer.pokemons.indexOf(
        parseInt(data.getPokemon.pokemonId)
      )}`
    );
  }

  let moveCard =
    data && data.getPokemon.moves
      ? data.getPokemon.moves.map((move) => {
          return <p className="fontC"> {move}</p>;
        })
      : null;

  const {
    loading: propsLoading,
    error: propsError,
    data: propsData,
  } = useQuery(queries.POKEMON, {
    fetchPolicy: "cache-and-network",
    variables: {
      pokemonId: trainerProps,
    },
  });
  // console.log(propsData);
  // console.log(`data.pokemonId:${data.pokemonId}`);

  const dispatch = useDispatch();
  const addToTrainer = (pokemon) => {
    dispatch(actions.addPokemon(Trainer.id, pokemon.getPokemon.pokemonId));
  };

  const release = (pokemon) => {
    console.log("in release");
    // console.log(`pokemon: ${JSON.stringify(pokemon)}`);
    console.log(
      `Trainer.id, pokemon.pokemonId: ${Trainer.id}, ${pokemon.getPokemon.pokemonId}`
    );
    dispatch(actions.deletePokemon(Trainer.id, pokemon.getPokemon.pokemonId));
  };

  const buildCard = (data) => {
    return (
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} key={data.pokemonId}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea className="cardDis">
            <CardMedia
              className={classes.media}
              component="img"
              image={
                data.sprites && data.sprites.official
                  ? data.sprites.official
                  : noImage
              }
              title="pokemon image"
            />

            <CardContent>
              <Typography
                className={classes.titleHead}
                gutterBottom
                variant="h6"
                component="h3"
              >
                {data.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="a"
                className="cardF"
              >
                {data.species
                  ? `Species: ${data.species}`
                  : "Species: Anonymous"}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className="PadDis"
                component="a"
              >
                <Typography className="styC"> Moves: </Typography>
                {moveCard && moveCard}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  card = data && buildCard(data.getPokemon);

  const buildTrainerCard = (data) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={data.pokemonId}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea className="cardDis">
            <Link to={`/pokemon/${data.pokemonId}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={
                  data.sprites && data.sprites.official
                    ? data.sprites.official
                    : noImage
                }
                title="pokemon image"
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {data.name}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (propsData && propsData.getPokemon) {
    trainerCard = buildTrainerCard(propsData.getPokemon);
  }

  if (props && props.pokemon) {
    if (propsError) {
      return (
        <div>
          <Error errorCode={propsError.message} />
        </div>
      );
    }
    if (propsLoading) {
      return <div> Loading...</div>;
    } else {
      return (
        <div>
          <Grid container className="classes.grid" spacing={5}>
            {trainerCard}
          </Grid>
        </div>
      );
    }
  } else {
    if (error) {
      console.log("error:");
      console.log(error);
      return (
        <div>
          <Error />
        </div>
      );
    }
    if (loading) {
      return <div>Loading......</div>;
    } else {
      return (
        <div>
          <Grid container className="classes.grid" spacing={5}>
            {card}
          </Grid>
          {Trainer &&
            data &&
            Trainer.pokemons.indexOf(parseInt(data.getPokemon.pokemonId)) ===
              -1 &&
            Trainer.pokemons.length < 6 && (
              <div className="PadDis">
                <Button
                  className="buttonD "
                  onClick={(event) => {
                    event.preventDefault();
                    addToTrainer(data);
                  }}
                >
                  Add to Train
                </Button>
              </div>
            )}
          {Trainer &&
            data &&
            Trainer.pokemons.indexOf(parseInt(data.getPokemon.pokemonId)) !==
              -1 &&
            Trainer.pokemons.length > 0 && (
              <div className="PadDis">
                <Button
                  className="buttonD PadDis"
                  onClick={(event) => {
                    event.preventDefault();
                    release(data);
                  }}
                >
                  Release
                </Button>
              </div>
            )}
          {!Trainer && (
            <div className="PadDis">
              <Button disable className="buttonD PadDis">
                No Trainer Selected
              </Button>
            </div>
          )}
          {Trainer && Trainer.pokemons.length >= 6 && (
            <div className="PadDis">
              <Button disable className="buttonD PadDis">
                Trainer Full
              </Button>
            </div>
          )}
        </div>
      );
    }
  }
};

export default PokemonDetail;
