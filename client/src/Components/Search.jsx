import React from "react";
import "../style/pokemonList.css";

const Search = (props) => {
  console.log(props);

  const handleChange = (e) => {
    console.log(e.target.value);
    props.searchValue(e.target.value);
  };
  return (
    <form
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name="pokemonName"
      className="center"
    >
      <label>
        <span className="space">Search Pokemon</span>
        <input
          autoComplete="off"
          type="text"
          name="searchTerm"
          onChange={handleChange}
        />
      </label>
    </form>
  );
};

export default Search;
