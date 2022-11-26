import React from "react";
import "../style/home.css";

const Home = () => {
  return (
    <div>
      <div>
        <h2>Introduction</h2>
      </div>
      <div className="pDis">
        <p>
          Click "All Pokemon", the page will take you to /pokemon/page/0, in
          that page, you can see all the pokemons which in the first page.
        </p>
      </div>

      <div>
        <p>
          Click "All Trainer", the page will take you to /trainers page, in that
          page, you can see all the trainers you add.
        </p>
      </div>

      <div>
        <p>
          Click "Add Trainer", the page will take you to /addtrainer page, in
          that page, you can add the trainer.
        </p>
      </div>

      <div className="pDis">
        <h2>Pokémon</h2>
      </div>
      <div className="pDis">
        <p>
          All pokemons are showed by card style, when you click a card, the page
          will take you to this pokemon's detail page (that means /pokemon/:id),
          that detail page will show you this pokemon's detail information.
        </p>
        <div className="pDis pBot moveleft">
          <p className="para">
            <span>Name:</span> This pokemon's name
          </p>
          <p className="para">
            <span>Abilities:</span> Will tell you what kind of abilities this
            pokemon can usein a battle or in the overworld. Pokémon have
            multiple possible abilities but can have only one ability at a time.
          </p>
          <p className="para">
            <span>Moves: </span>Moves are the skills of Pokémon in battle. In
            battle, a Pokémon uses one move each turn. Some moves (including
            those learned by Hidden Machine) can be used outside of battle as
            well, usually for the purpose of removing obstacles or exploring new
            areas.
          </p>
          <p className="para">
            <span>Species:</span> A Pokémon Species forms the basis for at least
            one Pokémon. Attributes of a Pokémon species are shared across all
            varieties of Pokémon within the species.
          </p>
          <p className="para">
            <span>Trainer:</span> If this Pokemon have his own trainer, it will
            shows the trainer's name.
          </p>
        </div>
      </div>
      <div className="pBot">
        <h2>Trainer</h2>
      </div>
      <div className="bot">
        <p>
          All trainers will showed by card style, when you click one trainer,
          the page will take you to the trainer detail page, in that page, you
          can see their pokemons, and you also can cancel the pokemon if you do
          not want to train.
        </p>
      </div>
    </div>
  );
};

export default Home;
