import { Button } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import actions from "../actions";

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
          Add a Trainer:
          <input
            onChange={(e) => handleChange(e)}
            id="name"
            name="name"
            placeholder="Input a name..."
            value={name}
          />
        </label>
      </div>
      <Button onClick={post}>Add</Button>
    </div>
  );
};

export default TrainerPost;
