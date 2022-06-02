
import React, { useContext, useEffect } from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import { FilmContext } from "../../context/film.context";
import Collection from "../collection/collection";
import "./container.scss"

const Container = ( ) =>{
    const { pathname } = useLocation();
    //sconsole.log(pathname);
    const { films, isload, run } = useContext(FilmContext);
    //console.log({ films, isload, run });
  useEffect(() => {
    run(pathname);
    // eslint-disable-next-line 
  }, [pathname]);

  return (
    <div className="film-container">
      {isload ? <Collection props={films} />:<h3>Ошибка загрузки</h3>}
    </div>
  );
};

export default Container;
