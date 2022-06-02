const Router = require("express");
const router = new Router();
const MainController = require("../controllers/main.controller");


router.get("/main/topFilms/:count",  MainController.getTopFilms)//список самых популярных фильмов
router.post("/main/recommendation/userBased",  MainController.getUserBasedRecommendation)//коллаборативная фильтрация по схожести пользователей
router.get("/main/recommendation/itemBased", isAuthenticated, MainController.getItemBasedRecommendation)//коллаборативная фильтрация по схожести пользователей
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) 
      return next();
      res.status(401).json("User not logged!")   
  }

module.exports = router;