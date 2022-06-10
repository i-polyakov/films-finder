import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./auth.context";
export const FilmContext = createContext();

const FilmContextProvider = (props) => {
 
  const [films, setFilms] = useState([]);
  const [isload, setIsLoad] = useState(true);
  //const newsSession = session.cookie
  ///newSession["passport"] = session.passport
  const run = async (location) => {
    try {
      //document.cookie = "connect.sid=s%3AuBho4LnxohtQDd73pw8_pl2AN4ew_NEK.31QnJZjx3wP9JMhKLgmQSSN8YckEe0cUPwHA2L46gwU"
      //axios.defaults.withCredentials =true; 
      //console.log(newSession)
      const response = await axios.get(
        `http://127.0.0.1:8080/api/films${location}`,{    
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setFilms(response);
      setIsLoad(true);
    } catch (error) {
      setIsLoad(false);
      console.log(error);
    }
  };

  return (
    <FilmContext.Provider value={{ films, isload, run }}>
      {props.children}
    </FilmContext.Provider>
  );
};

export default FilmContextProvider;
