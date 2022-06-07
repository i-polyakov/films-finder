import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FilmContext } from '../../context/film.context';
import translate from "translate";
import M from 'materialize-css/dist/js/materialize.min.js';
import "./film.page.scss"
import axios from 'axios';
const FilmPage = ({user}) => {
    const [isWant, setWant] = useState();
    const [isWatched, setWatched] = useState();
    const [genresRu, setGenresRu] = useState([])
    const [film, setfilm] = useState({})

    const { pathname } = useLocation();
    const { films, isload, run } = useContext(FilmContext);

    const getGenresRu = (genres) => {
        if (genres){        
            setGenresRu([])    
            genres.forEach( async (genre) => {
                try {                            
                    const gen = await translate(genre,{ to: "ru", engine: "google"})
                    setGenresRu( state => [...state, gen.toString().toLowerCase()])
                } catch (error) {
                    console.log(error);
                }
            })
        }     
    }
  
    useEffect(() => {
      run(pathname);
    }, [pathname]);

    useEffect(() => {
        if(films.data.genres){       
            setfilm(films.data)
            getGenresRu( films.data.genres)          
        }
    },[films])
    
    //   useEffect(() => {
    //   run(pathname);
    // }, [pathname]);
    const handleClickWant = async () => {
        console.log("handle");
        if(isWant){
            const response = await axios.delete(
                `http://127.0.0.1:8080/api/films/want/${film._id}`,{user: user},{    
                headers: {
                    "Content-Type": "application/json"
                }
                }
            );
            setWant(false)
        }else{
            const response = await axios.post(
                `http://127.0.0.1:8080/api/films/want`,{user: user, want:film._id},{    
                headers: {
                    "Content-Type": "application/json"
                }
                }
            );
            setWant(true)
            setWatched(false)
        }
    }
        const handleClickWatched =  () => {
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems);
            console.log("handle");
            // if(isWant){
            //     const response = await axios.delete(
            //         `http://127.0.0.1:8080/api/films/watched/${film._id}`,{user: user},{    
            //         headers: {
            //             "Content-Type": "application/json"
            //         }
            //         }
            //     );
            //     setWant(false)
            // }else{
            //     const response = await axios.post(
            //         `http://127.0.0.1:8080/api/films/watched`,{user: user, want:film._id},{    
            //         headers: {
            //             "Content-Type": "application/json"
            //         }
            //         }
            //     );
            //     setWant(true)
            //     setWatched(false)
            // }
    }
   // console.log(film.countries);
    return (            
        <div class="row main__container">
            <ul className=" wrapper">
                <li class="col s5 center-align">
                    <img src={film.image} alt={film.title} class="item__poster "/>
                    <div className="control">
                        <button class="item__want-button" onClick={handleClickWant}>Посмотрю</button>
                        <button data-target="modal1" class="btn modal-trigger item__watched-button"  onClick={handleClickWatched} >Просмотрен</button>				
                        <div id="modal1" class="modal">
                            <div class="modal-content">
                                <h4>Modal Header</h4>
                                <p>A bunch of text</p>
                            </div>
                            <div class="modal-footer">
                                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>            
                            </div>
                        </div>
                    </div>
                </li>
                <li class="col s7">
                    <div class="item__about-Film">
                        <div class="row__title truncate">{film.title} </div>
                        {/* <div class="row__year">{film.year}</div> */}
                    </div>
                    <table class='info'>                    
                        <tbody>
                        <tr>
                            <td>Премьера</td>
                            <td>{new Date(film.released).toLocaleDateString( "ru", {year: 'numeric', month: 'long', day: 'numeric' })}</td>  
                           
                        </tr>                       
                        <tr>
                            <td>Длительность</td> <td>{film?film.runtime:""}</td>             
                        </tr>
                        <tr>
                            <td>Страна</td> <td>{film.countries?film.countries.join(", "):""}</td>             
                        </tr>
                        <tr>
                            <td>Жанр</td> <td>{ genresRu?genresRu.join(", "):""}</td>             
                        </tr>              
                        <tr>
                            <td>Режиссер</td> <td>{film.directors?film.directors.join(", "):""}</td>             
                        </tr>
                        <tr>
                            <td>Сценариcт</td> <td>{film.writers?film.writers.join(", "):""}</td>             
                        </tr>
                        <tr>
                            <td>Актеры</td>
                            <td>   
                              
                                <div class="actors">
                                    {film.actors?film.actors.join(", "):"" }
                               </div>
                               
                           </td>             
                        </tr>
                        
                        </tbody>
                    </table>
                </li>
               
                    <div className="rating col s7"></div>
               
            </ul>
           
            {/* <div class="column">
                <button class="item__watch-button" onclick="changeStatusFilm(this)">Посмотрю</button>
                <button class="item__viewed-button" onclick="changeStatusFilm(this)">Просмотрен</button>					
            </div>
            <div class="column">
                <div class="item__rating-section">
                    <span class="item__rating">
                        <span > <%= (stat.avg==null||stat.avg==0)?'Нет оценки':parseFloat(stat.avg).toFixed(2)%></span>
                        <span class="item__rating-value">Рейтинг</span>
                    </span>
                    <span class="item__rating">
                        <span ><%= stat.watch %></span>
                        <span class="item__rating-count-watch"> Посмотрят</span>
                    </span>
                    <span class="item__rating">
                        <span ><%= stat.viewed %></span>
                        <span class="item__rating-count-viewed">Посмотрели</span>
                    </span>
                </div>
                
            </div>
            <div class="column">	
                <div class="wrap">
                    <p class="title">Обзор</p>
                    <p class="par">
                        <%= film.description %>
                        
                    </p>
                </div>
            </div> */}
       
        </div>
      
    );
}

export default FilmPage;
