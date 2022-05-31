
import React, { useContext, useEffect } from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import { FilmContext } from "../../context/film.context";
import Collection from "../collection/collection";


const Container = ({ tt }) =>{
    const { pathname } = useLocation();
    console.log(pathname);
    const { films, isload, run } = useContext(FilmContext);
    console.log({ films, isload, run });
  useEffect(() => {
    run(pathname);
    // eslint-disable-next-line 
  }, [pathname]);

  return (
    <div className="film-container">
      {isload ? <Collection data={films} />:<h3>Ошибка загрузки</h3>}
    </div>
  );
};

export default Container;
