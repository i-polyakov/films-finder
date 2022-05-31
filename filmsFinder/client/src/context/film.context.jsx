import React, { createContext, useState } from "react";
import axios from "axios";
export const FilmContext = createContext();

const FilmContextProvider = props => {
  const [films, setFilms] = useState([]);
  const [isload, setIsLoad] = useState(true);
  const run = async location => {
      try {
        console.log(location)
        const response = await axios.get(`https://127.0.0.1:8080/api/films/${location}`)
        console.log(response)
     
      } catch (error) {
        console.log(error)
      }
      }
      
  return (
    <FilmContext.Provider value={{ films, isload, run }}>
      {props.children}
    </FilmContext.Provider>
  );
};

export default FilmContextProvider;
