const Router = require("express");
const router = new Router();
const FilmsController = require("../controllers/films.controller");

//-----------user----------//
router.get("/film/:id", isAuthenticated, FilmsController.getFilmById)//Возвращает фильм по imd id
router.post("/film", isAuthenticated, FilmsController.getFilmsByTitle)//Возвращает фильм по названию
//router.get("/films", checkNotAuthenticated, FilmsController.getOrderFilms);//

router.get("/:login/want", isAuthenticated, FilmsController.getWantFilms);//Фильмы которые юзер хочет посмотреть
router.get("/:login/watched", isAuthenticated, FilmsController.getWatchedFilms);//Фильмы которые юзер посмотрел

router.post("/want", isAuthenticated, FilmsController.addWantFilm);//Добавить фильм в список посмотрю
router.delete("/want/:id", isAuthenticated, FilmsController.delWantFilm);//удалить из списка

router.post("/watched", isAuthenticated, FilmsController.addWatchedFilm);//Добавить фильм в список просмотренно
router.delete("/watched/:id", isAuthenticated, FilmsController.delWatchedFilm);//удалить из списка

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

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
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