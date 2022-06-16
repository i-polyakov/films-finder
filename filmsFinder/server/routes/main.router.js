const Router = require("express");
const router = new Router();
const MainController = require("../controllers/main.controller");


router.get("/main/topFilms/:count",  MainController.getTopFilms)//список самых популярных фильмов
router.post("/main/recommendation/userBased",  MainController.getUserBasedRecommendation)//коллаборативная фильтрация по схожести пользователей

module.exports = router;