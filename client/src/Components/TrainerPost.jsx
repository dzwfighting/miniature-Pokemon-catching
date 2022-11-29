import { Button } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import actions from "../actions";

import "../style/trainer.css";
import "../style/pokemonList.css";

const TrainerPost = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const post = () => {
    dispatch(actions.addTrainer(name));
    setName("");
  };
  return (
    <div>
      <div>
        <label>
          <span className="space">Add a Trainer:</span>
          <input
            onChange={(e) => handleChange(e)}
            id="name"
            name="name"
            placeholder="Input a name..."
            value={name}
          />
        </label>
      </div>
      <div className="btnC">
        <Button onClick={post} className="btnMo">
          <p className="fontC">Add</p>
        </Button>
      </div>
    </div>
  );
};

export default TrainerPost;
