const express = require("express");
const mongoose = require('mongoose');
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const AuthRouter = require("./routes/auth.router");
const MenuRouter = require("./routes/MenuRouter");
const FilmsRouter = require("./routes/films.router");
const UsersRouter = require("./routes/users.router");
const HomeRouter = require("./routes/home.router");
//const http_logs = require("./db/mongo/http_logs");
require("dotenv").config();
  
const PORT = process.env.PORT || 8080;

const app = express();

mongoose.connect('mongodb://localhost/filmsFinderDB').then(()=> console.log('filmsFinderDB connected.'))


app.use(require('morgan')('dev'));
app.use(require('cors')())
app.use(cookieParser('secret'));
app.use(flash());
app.use( session({
   cookie: { maxAge: 24*360000 },
    // Key we want to keep secret which will encrypt all of our information
    secret: "secret",
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
app.use(express.static(__dirname ));



// app.use(function(req, res, next){
//     res.locals.success_messages = req.flash('success_messages');
//     res.locals.error_messages = req.flash('error_messages');
//     res.locals.message = req.flash();

//     next();
// });


app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json())
.set("view engine", "ejs");

//app.use(http_logs);
app.use('/',AuthRouter);
app.use('/',MenuRouter);
app.use('/',FilmsRouter);
app.use('/',UsersRouter);

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
