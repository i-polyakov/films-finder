const Router = require("express");
const router = new Router();
const FilmsController = require("../controllers/films.controller");

//-----------user----------//
router.get("/film/:id", FilmsController.getFilmById)//Возвращает фильм по imd id
router.post("/film", FilmsController.getFilmsByTitle)//Возвращает фильм по названию
//router.get("/films", checkNotAuthenticated, FilmsController.getOrderFilms);//

router.get("/film/stat/:id", FilmsController.getStatFilmById)//Возвращает cтатистику фильма по imd id
router.get("/film/reviews/:id", FilmsController.getReviewsFilmById)//Возвращает отзывы фильма по imd id

router.get("/:login/want", FilmsController.getWantFilms);//Фильмы которые юзер хочет посмотреть
router.get("/:login/watched",FilmsController.getWatchedFilms);//Фильмы которые юзер посмотрел

router.post("/want",  FilmsController.addWantFilm);//Добавить фильм в список посмотрю
router.delete("/want/:id", FilmsController.delWantFilm);//удалить из списка

router.post("/watched", FilmsController.addWatchedFilm);//Добавить фильм в список просмотренно
router.delete("/watched/:id", FilmsController.delWatchedFilm);//удалить из списка

//-----------moder----------//

// router.post("/addFilm", check, FilmsController.addFilm);//добавить фильм  
// router.put("/updateFilm/:id", check, FilmsController.updateFilm);//обновить фильм  
// router.delete("/deleteFilm/:id", check, FilmsController.deleteFilm);//удалить фильм  



//router.post("/upRating", checkNotAuthenticated, FilmsController.upRating);//увеличить рейтинг фильму
//router.post("/downRating", checkNotAuthenticated, FilmsController.downRating)//уменьшить рейтинг фильму

//router.get("/filmPage/:id", checkNotAuthenticated, FilmsController.filmPage);//Возвращает фильм и статистику
//router.post("/filmStatistics", checkNotAuthenticated, FilmsController.filmStatistics);//статистика фильма
//router.post("/checkStatusFilm", checkNotAuthenticated, FilmsController.checkStatusFilm);
//router.post("/changeStatusFilm", checkNotAuthenticated, FilmsController.changeStatusFilm);

function checkIsAuthenticated(req, res, next) {
  console.log("#####################");
  //req.headers.session.forEach(element => {
    //console.log( req.headers);
   // console.log( req.session);
  //});
  console.log(req.user);
  if (req.isAuthenticated()) {
    console.log("isAuth");
    return next();
  }
   
  res.status(401).json("User not logged!")   
}

function check(req, res, next) {
  if (req.isAuthenticated()){
    if(req.user.role_id!=1&&req.user.role_id!=2)
    return  res.status(403).json({
          "error_messages":"Нет прав!"
    
        });
    return next();
  } 
  
  res.status(401).json("User not logged!")   
 
}

module.exports = router;