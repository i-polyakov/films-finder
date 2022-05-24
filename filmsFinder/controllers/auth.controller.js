const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const User = require("../models/user.js");

const options = {
        // by default, local strategy uses username
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    };


passport.serializeUser((user, done) =>{    console.log("111"+ user.id); done(null, user._id)    });

  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user
passport.deserializeUser((id, done) => {
   console.log("223" + id)    
    User.findById(id, user=>{   
      console.log("123"+user)    
      return done(null, user)
    });
         
});

passport.use('login',new LocalStrategy(options, (req, username, password, done) => {
  // check to see if the username exists
  User.findOne({ login: username }).then(user=>{
    if (user) {   
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


passport.use('register',new LocalStrategy(options, (req, username, password, done) => {
  let password_confirm = req.body.password_confirm;
  
  if (!username  || !password || !password_confirm) 
    return done(null, false, req.flash( 'error_messages', 'Заполните все поля!') );
  
  if (password.length < 5) 
    return done(null, false, req.flash( 'error_messages', 'Пароль слишком короткий! (не менее 5 символов)') );

  if (password !== password_confirm) 
    return done(null, false, req.flash( 'error_messages', 'Пароли не совпадают!' ));
     
  hashPassword(password).then( (hashedPassword) => {
    // Validation passed
    User.findOne({login: username }).then(user=>{
      if (user) 
        return done(null, false,req.flash( 'error_messages', 'Логин занят!!' ));         
      else{
        const user = new User({
          login: username,
          password: hashedPassword
        });
        user.save();
        console.log(user);
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