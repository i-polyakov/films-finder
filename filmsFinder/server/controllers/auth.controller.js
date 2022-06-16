const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const User = require("../models/user.js");

const options = {
        // by default, local strategy uses username
        usernameField : 'login',
        passwordField : 'password',
        passReqToCallback : true
    };

passport.serializeUser((user, done) => {done(null, user._id)});

  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user
passport.deserializeUser((_id, done) => {
  console.log("_id");
  console.log(_id);
  User.findById(_id).then( (err,user)=>{     
    console.log("findById");
    console.log(user); 
    return done(err, user)
  });         
});

passport.use('login', new LocalStrategy(options, (req, login, password, done) => {
  
  // check to see if the username exists
  User.findOne({ login: login }).then(user=>{
    if (user) {   
     
      //hashPassword(password).then(hash=>console.log(hash))
      bcrypt.compare(password, user.password, (err, result) => {
       
        if (err) 
          console.error(err);
  
        if (result) 
          return done(null, user );     
        else  //password is incorrect                
          return done(null, false, req.flash( 'error_messages', "Неправильный пароль!"));     
      });

    } else  // No user
      return done(null, false,  req.flash( 'error_messages', "Пользователь не существует!"));
  });  
}));


passport.use('registration',new LocalStrategy(options, (req, login, password, done) => {
  //console.log(req.body);
  let password_confirm = req.body.password_confirm;
  
  if (!login  || !password || !password_confirm) 
    return done(null, false, req.flash( 'error_messages', 'Заполните все поля!') );
  
  if (password.length < 4) 
    return done(null, false, req.flash( 'error_messages', 'Пароль слишком короткий! (не менее 4 символов)') );

  if (password !== password_confirm) 
    return done(null, false, req.flash( 'error_messages', 'Пароли не совпадают!' ));
     
  hashPassword(password).then( (hashedPassword) => {
    // Validation passed
    User.findOne({login: login }).then(user=>{
      if (user) 
        return done(null, false,req.flash( 'error_messages', 'Логин занят!!' ));         
      else{
        const user = new User({
          login: login,
          password: hashedPassword
        });
        user.save();
        //console.log(user);
        return done(null, user);
      }
    });
  }).catch( (err) => {
    console.log(err);
  });
}));


async function hashPassword (password) {

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err)
        resolve(hash);
    });
  })

  return hashedPassword;
}

module.exports = passport;