import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./auth.context";
export const FilmContext = createContext();

const FilmContextProvider = props => {
  const {login} = useContext(AuthContext)
  //console.log(localStorage.getItem("userData"));
  const [films, setFilms] = useState([]);
  const [isload, setIsLoad] = useState(true);
  const run = async location => {
      try {
        console.log(location)
        const response = await axios.get(`http://127.0.0.1:8080/api/films${location}`)
        setFilms(response)
        setIsLoad(true)
      } catch (error) {
        setIsLoad(false);
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
