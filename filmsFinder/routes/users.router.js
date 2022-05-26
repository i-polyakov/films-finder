const Router = require("express");
const router = new Router();
const UsersController = require("../controllers/users.controller");

//-----------admin----------//
router.post("/users", isAdminAuthenticated, UsersController.getUsersByLogin)//пользователи с похожим логином
router.get("/users/:roleName", isAdminAuthenticated, UsersController.getUsersByRole);//вывести пользователей по роли
router.put("/changeRole/:login", isAdminAuthenticated, UsersController.updateUser);//изменить уровень доступа  
router.delete("/deleteUser/:login", isAdminAuthenticated, UsersController.deleteUser);//удалить пользователя  

router.put("/users/follow/:login", isAuthenticated, UsersController.followUser)//подписаться на пользователя
router.delete("/users/follow/:login", isAuthenticated, UsersController.unFollowUser)//отписаться 
router.get("/users/:login/following", isAuthenticated, UsersController.getFollowing);//подписки пользователя
router.get("/users/:login/ollowers", isAuthenticated, UsersController.getFollowers);//подписчики пользователя

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) 
      return next();
      res.status(401).json("User not logged!")   
  }

function isAdminAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        if(req.user.role === "admin")
            return next();    
        res.status(403).json({
            "error_messages":"Нет прав!"
            })    
    }    
    res.status(401).json("User not logged!")   
    //res.redirect("/login");
  }
  module.exports = router;