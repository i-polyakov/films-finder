import React, { createContext, useContext, useState } from "react";
import axios from "axios";
export const RecContext = createContext();

const RecContextProvider = (props) => {
  //console.log(props);
  const [userBased, setUserBasedRecFilms] = useState([]);
  const [topFilms, setTopFilms] = useState([]);
  const [isload, setIsLoad] = useState(true);
  const run = async (user) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/main/recommendation/userBased",
        { user: user.user }
      );
      setUserBasedRecFilms(response);
      setIsLoad(false);
      const res = await axios.get("http://127.0.0.1:8080/api/main/topFilms/10");
      setTopFilms(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RecContext.Provider value={{ userBased, topFilms, isload, run }}>
      {props.children}
    </RecContext.Provider>
  );
};

export default RecContextProvider;
