// import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./Components/Error";
import PokemonList from "./Components/PokemonList";
import TrainerList from "./Components/TrainerList";
import TrainerPost from "./Components/TrainerPost";
import Navigation from "./Components/Navigation";
import PokemonDetail from "./Components/PokemonDetail";
import TrainerDetail from "./Components/TrainerDetail";
import Home from "./Components/Home";

import logo from "./img/tiger.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@khanacademy/tota11y";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/pokemon/page/:pagenum"
              element={<PokemonList />}
            >
              All Pokemons
            </Route>
            <Route exact path="/pokemon/:id" element={<PokemonDetail />} />
            <Route exact path="/trainers" element={<TrainerList />}>
              All trainers
            </Route>
            <Route exact path="/trainer/:id" element={<TrainerDetail />} />
            <Route exact path="/addtrainer" element={<TrainerPost />}>
              Add Trainer
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
