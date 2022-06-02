import React, { createContext, useContext, useState } from "react";
import axios from "axios";
export const SearchContext = createContext();

const SearchContextProvider = props => {
  //console.log(props);
  const [films, setFilms] = useState([]);
    const [isload, setIsLoad] = useState(true);
    const run = async (searchTerm) => {
        try {
          console.log("context "+searchTerm);
          const response = await axios.post('http://127.0.0.1:8080/api/films/film',{search: searchTerm})
          console.log(response);
          setFilms(response)
          setIsLoad(false)
        } catch (error) {
          
          console.log(error)
        }
    };
  return (
    <SearchContext.Provider value={{ films, isload, run }}>
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
