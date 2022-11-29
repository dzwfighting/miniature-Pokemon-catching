import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import TrainerDetail from "./TrainerDetail";
import TrainerPost from "./TrainerPost";

import Error from "./Error";

import "../style/pokemonDetail.css";
import "../style/pokemonList.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@material-ui/core";

const TrainerList = () => {
  const allTrainers = useSelector((state) => state.trainer);
  const [addTrainerBtn, setAddTrainerBtn] = useState(false);
  console.log(allTrainers);

  return (
    <div>
      <div>
        <Button
          onClick={() => setAddTrainerBtn(!addTrainerBtn)}
          className="buttonD "
        >
          Add a Trainer
        </Button>
        <br />
        <br />
        <br />
        <br />

        {addTrainerBtn && <TrainerPost />}
        <br />
        <br />
        <br />
      </div>

      {allTrainers.map((trainer) => {
        console.log(trainer);
        return <TrainerDetail key={trainer.id} trainer={trainer} />;
      })}
    </div>
  );
  //   const classes = useStyles();
  //   const [needDelete, setNeedDelete] = useState(false);
  //   let card = null;
  //   let smallCard = null;
  //   const { loading, error, data } = useQuery(queries.TRAINERS, {
  //     fetchPolicy: "cache-and-network",
  //   });
  //   console.log(loading, error, data);
  //   async function deleteTrainer(trainerId) {}
  //   const buildCard = (trainer) => {
  //     return (
  //       <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={trainer.trainerId}>
  //         <Card className={classes.card} variant="outlined">
  //           <CardActionArea>
  //             <Link to={`/trainer/${trainer.trainerId}`}>
  //               <CardContent>
  //                 <Typography
  //                   className={classes.titleHead}
  //                   gutterBottom
  //                   variant="h6"
  //                   component="h3"
  //                 >
  //                   Trainer: {trainer.name}
  //                 </Typography>
  //                 <Typography variant="body2" color="textSecondary" component="p">
  //                   Pokemons: {smallCard ? smallCard : "Empty"}
  //                 </Typography>
  //               </CardContent>
  //             </Link>
  //           </CardActionArea>
  //           <Button onClick={deleteTrainer(trainer.trainerId)}>Delete</Button>
  //         </Card>
  //       </Grid>
  //     );
  //   };
  //   const small = (pokemon) => {
  //     return (
  //       <Typography variant="body2" color="textSecondary" component="p">
  //         {pokemon.name}
  //       </Typography>
  //     );
  //   };
  //   card =
  //     data &&
  //     data.allTrainer.map((trainer) => {
  //       smallCard =
  //         trainer.pokemons &&
  //         trainer.pokemons.map((pokemon) => {
  //           console.log(pokemon);
  //           return small(pokemon);
  //         });
  //       return buildCard(trainer);
  //     });
  //   if (error) {
  //     return (
  //       <div>
  //         <Error />
  //       </div>
  //     );
  //   }
  //   if (loading) {
  //     return <div>Loading......</div>;
  //   } else {
  //     return (
  //       <div>
  //         <Grid container className="classes.grid" spacing={5}>
  //           {card}
  //         </Grid>
  //       </div>
  //     );
  //   }
};

export default TrainerList;
