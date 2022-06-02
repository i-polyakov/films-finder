import React from 'react'
import './film.scss'
export default function Film({info}) {
   if(info.filmId)
      info = info.filmId
  return (
    <li class="column">  
        <div class="column__item">
            <div class="item__about-Film">
                    <div class="row__title truncate">{info.title} </div>
                    <div class="row__year">{info.year}</div>
            </div>
            <div class="poster"> <img src={info.image} alt={info.title} class="item__poster"/></div>
           
        </div>
    </li>
   
  )
}
