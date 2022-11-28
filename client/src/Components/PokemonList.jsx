import React from "react";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import actions from "../actions";

import noImage from "../img/download.jpeg";
import Error from "./Error";

import "bootstrap/dist/css/bootstrap.min.css";
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
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
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
    fontSize: 12,
  },
});

const PokemonList = () => {
  const classes = useStyles();
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const temp = useParams();
  const [pageNum, setPageNum] = useState(parseInt(temp.pagenum));
  const [Trainer] = useContext(context);

  // console.log(temp.pagenum);
  console.log(Trainer);

  console.log(pageNum);

  let card = null;
  const navigate = useNavigate();

  // const prevPage = async () => {

  //   setPageNum(pageNum - 1);
  // };

  // console.log(allPokemonError.message);

  // const nextPage = async () => {

  //   console.log("in");
  //   setPageNum(pageNum + 1);
  // };

  const {
    loading: allPokemonLoading,
    error: allPokemonError,
    data: allPokemonData,
  } = useQuery(queries.POKEMONS, {
    fetchPolicy: "cache-and-network",
    variables: {
      pageNum: pageNum,
    },
  });

  console.log(allPokemonLoading, allPokemonError, allPokemonData);

  const checkNext = useQuery(queries.POKEMONS, {
    fetchPolicy: "cache-and-network",
    variables: {
      pageNum: pageNum + 1,
    },
  }).error;
  console.log(checkNext);

  const dispatch = useDispatch();

  const addToTrainer = (pokemon) => {
    console.log(`in addToTrainer: ${pokemon}`);
    dispatch(actions.addPokemon(Trainer.id, pokemon.pokemonId));
  };

  const release = (pokemon) => {
    // console.log(`in release: ${JSON.stringify(pokemon)}`);
    console.log(`in release: ${pokemon.pokemonId}`);
    dispatch(actions.deletePokemon(Trainer.id, pokemon.pokemonId));
  };

  async function next() {
    setPageNum(pageNum + 1);
    console.log(`in next, update the page: ${pageNum}`);
  }
  async function prev() {
    setPageNum(pageNum - 1);
    console.log(`in prev, update the page: ${pageNum}`);
  }

  useEffect(() => {
    console.log("in useEffect");
    async function reRender() {
      let path = `/pokemon/page/${pageNum}`;
      navigate(path);
    }

    async function checkPage() {
      if (pageNum === 0) {
        setShowPrevious(false);
      } else {
        setShowPrevious(true);
      }

      if (checkNext) {
        console.log("in");
        setShowNext(false);
        return;
      } else {
        setShowNext(true);
      }

      // setPageNum(pageNum - 1);
    }
    checkPage();
    reRender();
  }, [pageNum, checkNext]);

  const buildCard = (data) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={data.pokemonId}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
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
                <Typography variant="body2" color="textSecondary" component="p">
                  {data.species
                    ? `Species: ${data.species}`
                    : "Species: Anonymous"}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {data.trainer ? `Trainer: ${data.trainer}` : "Trainer: No"}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
          {Trainer &&
            data &&
            Trainer.pokemons.indexOf(parseInt(data.pokemonId)) === -1 &&
            Trainer.pokemons.length < 6 && (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  addToTrainer(data);
                }}
              >
                Add to Train
              </Button>
            )}
          {Trainer &&
            data &&
            Trainer.pokemons.indexOf(parseInt(data.pokemonId)) !== -1 &&
            Trainer.pokemons.length > 0 && (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  release(data);
                }}
              >
                Release
              </Button>
            )}
          {!Trainer && <Button disable>No Trainer Selected</Button>}
          {Trainer && Trainer.pokemons.length >= 6 && (
            <Button disable>Trainer Full</Button>
          )}
        </Card>
      </Grid>
    );
  };

  card =
    allPokemonData &&
    allPokemonData.allPokemon.map((pokemon) => {
      return buildCard(pokemon);
    });

  if (allPokemonError) {
    return (
      <div>
        <Error errorCode={allPokemonError.message} />
      </div>
    );
  }
  if (allPokemonLoading) {
    return <div> Loading...... </div>;
  } else {
    return (
      <div>
        <div>
          {showPrevious ? <Button onClick={prev}>Previous</Button> : <p></p>}
        </div>

        <div>{showNext ? <Button onClick={next}>Next</Button> : <p></p>}</div>

        <Grid container className="classes.grid" spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default PokemonList;
