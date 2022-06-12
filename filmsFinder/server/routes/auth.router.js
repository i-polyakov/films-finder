const AuthenticateController = require("../controllers/auth.controller");
const Router = require("express");
const router = new Router();

// Funtion inside passport which initializes passport
router.use(AuthenticateController.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
router.use(AuthenticateController.session());


router.post( "/api/auth/login", function(req, res, next) {
  AuthenticateController.authenticate('login', function(err, user, info) {
    console.log(err,user);
    if (err) 
      return next(err); 

    if (!user)  
      return res.status(401).json(req.session.flash); 
      
    req.logIn(user, function(err) {
      if (err) 
       return next(err); 
      
       return res.json({ session: req.session, user});
    });
    
  })(req, res, next);
  });


router.post( "/api/auth/registration", function(req, res, next) {
  
  AuthenticateController.authenticate('registration', function(err, user, info) {
    if (err) 
     return next(err); 
    if (!user){
      console.log(req.session.flash);
      return res.status(400).json(req.session.flash); 
    }
   
    req.logIn(user, function(err) {
      if (err) 
       return next(err); 
     
      return res.json(user);
    });
  })(req, res, next);
  });

  router.get("/api/auth/logOut", (req, res) => {
    req.logout();
    res.json("User logged out")     
  });
  
router.get("/api/auth/registration", checkAuthenticated, (req, res) => {
    res.render(__dirname + "/../src/ejs/register.ejs");
});

router.get("/api/auth/", checkAuthenticated, (req, res) => {
    res.render(__dirname + "/../src/ejs/login.ejs");
});

router.get("/api/auth/login", checkAuthenticated, (req, res) => {
  
    res.render(__dirname + "/../src/ejs/login.ejs");
});


/*router.get("/logOut", (req, res) => {
	req.logout();
    res.render(__dirname + "/../src/ejs/login.ejs");
});
*/

function checkAuthenticated(req, res, next) {
  
  if (req.isAuthenticated()) 
    return res.redirect("/api/auth/");
  
  next();
}


module.exports = router;