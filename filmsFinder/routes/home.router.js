const Router = require("express");
const router = new Router();
const HomeController = require("../controllers/home.controller");


router.get("/home", isAuthenticated, HomeController.getRecommendations)//пользователи с похожим логином

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) 
      return next();
      res.status(401).json("User not logged!")   
  }