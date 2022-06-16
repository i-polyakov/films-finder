import React, { useContext, useEffect } from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import { FilmContext } from "../../context/film.context";
import { RecContext } from "../../context/rec.context";
import Collection from "../collection/collection";
import "./recContainer.scss";

const RecContainer = (user) => {
  const { pathname } = useLocation();
  const { userBased, topFilms, isload, run } = useContext(RecContext);
  console.log(user);
  useEffect(() => {
    run(user);
  }, [user]);
  let rec;
  if(userBased.data && userBased.data.length>0)
   rec = <Collection props={userBased} user={user} />
  else
   rec = <h6>Мало оценок, оцените больше фильмов</h6>
  return (
    <div className="film-container">
      <div class="col s12 m6">
        <div class="card horizontal">
          <div class="card-stacked">
            <div class="card-content">
              <span class="card-title">Рекомендации для вас</span>
              {rec}
            </div>
            <hr />
            <div class="card-content">
              <span class="card-title">Топ 10 фильмов</span>
              {!isload ? (
                <Collection props={topFilms} user={user} />
              ) : (
                <h3>Ошибка загрузки</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecContainer;
