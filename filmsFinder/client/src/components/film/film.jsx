import React from "react";
import { NavLink } from "react-router-dom";
import "./film.scss";
export default function Film({ info, isSearch }) {
  console.log(info);
  if (info.filmId) 
    info = info.filmId;
  return (
    <li class="column">
      <NavLink
        to={`/film/${isSearch? info.id:info.imdb.id}`}
      >
      <div class="column__item">
        <div class="item__about-Film">
          <div class="row__title truncate">{info.title} </div>
          <div class="row__year">{info.year}</div>
        </div>
        <div class="poster">
          {" "}
          <img src={info.image} alt={info.title} class="item__poster" />
        </div>
      </div>
      </NavLink>
    </li>
  );
}
