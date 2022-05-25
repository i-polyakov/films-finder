const Router = require("express");
const router = new Router();
const FilmsController = require("../controllers/films.controller");

//-----------user----------//
router.get("/film/:id", checkNotAuthenticated, FilmsController.getFilmById)//Возвращает фильм по imd id
router.post("/film", checkNotAuthenticated, FilmsController.getFilmsByTitle)//Возвращает фильм по названию
//router.get("/films", checkNotAuthenticated, FilmsController.getOrderFilms);//

router.get("/want", checkNotAuthenticated, FilmsController.wantFilms);//Фильмы которые юзер хочет посмотреть
router.get("/watched", checkNotAuthenticated, FilmsController.watchedFilms);//Фильмы которые юзер посмотрел

router.post("/want", checkNotAuthenticated, FilmsController.wantFilm);//Добавить фильм в список посмотрю
router.delete("/want", checkNotAuthenticated, FilmsController.unwatchFilm);//удалить из списка

router.post("/viewedFilm", checkNotAuthenticated, FilmsController.viewedFilm);//Добавить фильм в список просмотренно
router.delete("/unviewedFilm", checkNotAuthenticated, FilmsController.unviewedFilm);//удалить из списка

//-----------moder----------//

router.post("/addFilm", check, FilmsController.addFilm);//добавить фильм  
router.put("/updateFilm/:id", check, FilmsController.updateFilm);//обновить фильм  
router.delete("/deleteFilm/:id", check, FilmsController.deleteFilm);//удалить фильм  



//router.post("/upRating", checkNotAuthenticated, FilmsController.upRating);//увеличить рейтинг фильму
//router.post("/downRating", checkNotAuthenticated, FilmsController.downRating)//уменьшить рейтинг фильму

//router.get("/filmPage/:id", checkNotAuthenticated, FilmsController.filmPage);//Возвращает фильм и статистику
//router.post("/filmStatistics", checkNotAuthenticated, FilmsController.filmStatistics);//статистика фильма
//router.post("/checkStatusFilm", checkNotAuthenticated, FilmsController.checkStatusFilm);
//router.post("/changeStatusFilm", checkNotAuthenticated, FilmsController.changeStatusFilm);

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  res.json("User not logged!")   
}

function check(req, res, next) {
  if (req.isAuthenticated()){
    if(req.user.role_id!=1&&req.user.role_id!=2)
    return  res.status(403).json({
          "error_messages":"Нет прав!"
    
        });
    return next();
  } 
  
  res.json("User not logged!")   
 
}

module.exports = router;