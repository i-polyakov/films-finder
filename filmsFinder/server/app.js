const express = require("express");
const mongoose = require('mongoose');
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const AuthRouter = require("./routes/auth.router");
const FilmsRouter = require("./routes/films.router");
const UsersRouter = require("./routes/users.router");
const MainRouter = require("./routes/main.router");
const passport = require('passport');
//const http_logs = require("./db/mongo/http_logs");
require("dotenv").config();
  
const PORT = process.env.PORT || 8080;

const app = express();

mongoose.connect('mongodb://localhost/filmsFinderDB').then(()=> console.log('filmsFinderDB connected.'))

app.use(require('morgan')('dev'));
app.use(require('cors')({
  origin: "http://localhost:3000",
  credentials: true
}))
// 

app.use(flash());





// app.use(function(req, res, next){
//     res.locals.success_messages = req.flash('success_messages');
//     res.locals.error_messages = req.flash('error_messages');
//     res.locals.message = req.flash();

//     next();
// });

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secretCode'));
//app.use(express.static(__dirname ));
app.use( session({
  // cookie: { maxAge: 24*360000,  SameSite: "None",  secure: true },
   
    // Key we want to keep secret which will encrypt all of our information
    secret: "secretCode",
    // Should we resave our session variables if nothing has changes which we dont
    resave: true,
    // Save empty value if there is no value which we do not want to do
    saveUninitialized: true
  })
);
//app.use(passport.authenticate('session'));

// parse application/json

// .set("view engine", "ejs");

// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());


//app.use(http_logs);
app.use('/',AuthRouter);
app.use('/api/films/',FilmsRouter);
app.use('/api',UsersRouter);
app.use('/api',MainRouter);

app.use((error, req, res, next) => {
  // Установка кода состояния ответа
  res.status(error.status)

  // Отправка ответа
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
