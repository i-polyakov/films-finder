import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FilmContext } from '../../context/film.context';
import translate from "translate";
import M from 'materialize-css/dist/js/materialize.min.js';
import "./film.page.scss"
import axios from 'axios';
import { AuthContext } from '../../context/auth.context';
const FilmPage = () => {
    const [isWant, setWant] = useState();
    const [isWatched, setWatched] = useState();
    const [rating, setRating] = useState()
    const [stat, setStat] = useState({})
    const [reviews, setReviews] = useState([])
    const [sortedReviews, setSortedReviews] = useState([])
    const [genresRu, setGenresRu] = useState([])
    const [film, setfilm] = useState({})

    const { user, setUser } = useContext(AuthContext);
    const { films, isload, run } = useContext(FilmContext);
    const { pathname } = useLocation();
   
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
    const getStat = async (film) =>{
        //console.log("getStat");
        const response = await axios.get(
            `http://127.0.0.1:8080/api/films/film/stat/${film.imdb.id}`,{    
            headers: {
                "Content-Type": "application/json"
            }
        }
        );
        setStat(response.data)   
    }
    const getReviews = async (film) =>{
        //console.log("getReviews");
        //console.log(film);
        const response = await axios.get(
            `http://127.0.0.1:8080/api/films/film/reviews/${film.imdb.id}`,{    
            headers: {
                "Content-Type": "application/json"
            }
        }
        );
        //console.log(response.data);
        setReviews(response.data)   
    }

    useEffect(() => {
        const sorted = []
        const noFollowing = []

        reviews.map(item=>{   
            if(item.login===user.login){
                sorted.unshift(item)
            }
            else if(user.following.find(elem=>String(elem)===String(item._id)))               
                sorted.push(item)      
            else            
                noFollowing.push(item)
        })
        setSortedReviews(sorted.concat(noFollowing))  
        // setSortedReviews(reviews.sort((a,b)=>{
        //     if(a.login===user.login){
        //         return -2
        //     }         
        //     else if(user.following.find(item=>String(item)===String(a._id)))               
        //         return -1         
        //     else            
        //         return 1
        //     }))  
    }, [reviews])
    
    useEffect(() => {
      run(pathname);
    }, [pathname]);

    useEffect(() => {
        if(films.data&&films.data.genres){       
            setfilm(films.data)
            getGenresRu( films.data.genres)     
            getStat(films.data)          
            getReviews(films.data)    
        }
    },[films])
    
    useEffect(() => {
        setWatched(false)
        setWant(false)
        setRating(null) 

        if(user.watched)
        for (var element of user.watched) 
            if (element.filmId === film._id) {    
                setRating(element.rating)         
                setWatched(true)
                setWant(false)
            }
        if(user.want)
            for (var element of user.want) 
                if (element === film._id) {     
                    setRating(null)               
                    setWatched(false)
                    setWant(true)
                }         
    });

    const handleClickWant = async () => {
        console.log("handle want");
        if(isWant){
            const response = await axios.delete(
                `http://127.0.0.1:8080/api/films/want/${film._id}`,{    
                headers: {
                    "Content-Type": "application/json"
                },
                data:{user: user}
            }
            );
           
            if(response.data._id === user._id){
                setUser(response.data)
                setWant(false)
            }
        }else{
            const response = await axios.post(
                `http://127.0.0.1:8080/api/films/want`,{user: user, want:film._id},{    
                headers: {
                    "Content-Type": "application/json"
                }
                }
            );
           
        if(response.data._id === user._id){
            setUser(response.data)
            setWant(true)
            setWatched(false)
        }
        }
    }
    const handleClickWatched = async () => {
            
            if(isWatched){
                const response = await axios.delete(
                    `http://127.0.0.1:8080/api/films/watched/${film._id}`,{    
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data:{user: user}
                    }
                );
                if(response.data._id === user._id){
                    setRating(null)
                    setUser(response.data)
                    setWatched(false)
                }
            }else{
            //Показать модальное окно
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems);
            console.log("handle watched");       
            }
    }
    const handleClickSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.post(
            `http://127.0.0.1:8080/api/films/watched/`,{
                user: user,
                watched:{
                    filmId: film._id,
                    ...(e.target.group1.value>0 && {  rating: e.target.group1.value }),
                    ...(e.target.textarea1.value.trim() && { review: e.target.textarea1.value.trim() })                   
                } },
                {    
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
        );
        if(response.data._id === user._id){
            setRating(e.target.group1.value)
            setUser(response.data)
            setWant(false)
            setWatched(true)
        }

    }   
    return (            
        <div class="row main__container">
            <ul className=" wrapper">
                <li class="col s5 center-align">
                    <img src={film.image} alt={film.title} class="item__poster "/>
                    <div className="control">
                        <div className="wrapp__button s5">
                            <button 
                                class={isWant? ' btn waves-effect waves-light item__want-button active' : 'btn waves-effect waves-light item__want-button'} 
                                onClick={handleClickWant}>Посмотрю
                            </button>
                            <button data-target="modal1" 
                                class={isWatched? 'btn waves-effect waves-light modal-trigger item__watched-button active' : 'btn waves-effect waves-light modal-trigger item__watched-button'}  
                                onClick={handleClickWatched} >Просмотрен
                            </button>				
                        </div> 
                        <div id="modal1" class="modal">
                            <div class="modal-content">
                                <form class="col s12" onSubmit={handleClickSubmit}>                                 
                                    <div class="row">
                                        <div class="input-field col s12">
                                        <textarea id="textarea1" class="materialize-textarea"></textarea>
                                        <label for="textarea1">Отзыв о фильме</label>
                                        </div>
                                    </div>
                                    <div className="row radioButtons">
                                        <h5>оценка</h5>
                                            <div className="col s1 center-align">
                                                <label for="0"><span>X</span></label>
                                                <input name="group1" id="0" value="0" type="radio"/>
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="1"><span>1</span></label>
                                                <input name="group1" id="1" value="1" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="2"><span>2</span></label>
                                                <input name="group1" id="2" value="2" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="3"><span>3</span></label>
                                                <input name="group1" id="3" value="3" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="4"><span>4</span></label>
                                                <input name="group1" id="4" value="4" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="5"><span>5</span></label>
                                                <input name="group1" id="5" value="5" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="6"><span>6</span></label>
                                                <input name="group1" id="6" value="6" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="7"><span>7</span></label>
                                                <input name="group1" id="7" value="7" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="8"><span>8</span></label>
                                                <input name="group1" id="8" value="8" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="9"><span>9</span></label>
                                                <input name="group1" id="9" value="9" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                            <div className="col s1 center-align">
                                                <label for="10"><span>10</span></label>
                                                <input name="group1" id="10" value="10" type="radio" />
                                                <span class ="span-after"></span>
                                            </div>
                                        
                                    </div>
                                  
                                    <div class="modal-footer">
                                    <input  class="modal-close waves-effect btn-flat submit" type="submit" value="Сохранить"  />
                                       
                                               
                                     </div>
                                </form>           
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
                        <tr>
                            <td>Возраст</td> <td>{film?film.contentRating:""}</td>             
                        </tr>
                        </tbody>
                    </table>
                </li>
                <hr/>
                <div className="stat">
                    <div className="heading">
                        
                    </div>          
                    {rating?
                    <div className="rating col">
                        <div className="rating-title center-align">
                            Моя оценка
                        </div>  
                        <div className="rating-count center-align">
                            {rating}
                        </div>
                    </div>:""}
                    <div className="rating col">
                        <div className="rating-title center-align">
                            Рейтинг фильма
                        </div>
                        <div className="rating-count center-align">
                            {stat.avg?stat.avg.toFixed(1):""}
                        </div>
                    </div>
                    <div className="rating col">
                        <div className="rating-title center-align">
                            Посмотрят
                        </div>
                        <div className="rating-count center-align">
                            {stat.want}
                        </div>
                    </div>
                    <div className="rating col">
                        <div className="rating-title center-align">
                            Посмотрели
                        </div>
                        <div className="rating-count center-align">
                            {stat.watched}
                        </div>
                    </div>
                    <div className="rating col">
                        <div className="rating-title center-align">
                            Imdb
                        </div>
                        <div className="rating-count center-align">
                            {film.imdb?film.imdb.rating:""}
                        </div>
                    </div>  
                    <div className="rating col">
                        <div className="rating-title center-align">
                            Metacritic
                        </div>
                        <div className="rating-count center-align">
                            {film?film.metacriticRating:""}
                        </div>
                    </div>  
                   
                </div> 
                <hr/>
                <div className="overview">
                    <div className="heading">
                        Обзор
                    </div>
                    <div className="text ">
                        {film.plot}
                    </div>     
                </div>  
                <hr/>
         
                <div className="reviews">
                    <div className="heading">
                        Отзывы
                    </div>
                    {sortedReviews.map((review)=>{
                        return<div className="user-review col">
                            <div className="user-login">
                                {review.login}   
                                <div className="user-rating">
                                    {review.rating}    
                                </div> 
                            </div>
                              
                            <div className="review">
                                {review.review}    
                            </div>
                        </div>
                    })}
                   
                    
                   
                </div> 
               

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
