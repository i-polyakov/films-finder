const User = require("../models/user.js");
const Film = require("../models/film.js");
const createError = require('http-errors')
const imdb = require('../services/imdb-api.js')

class FilmsController {
  async getFilmById(req, res) { //page
    try {
      const film = await Film.findOne({'imd.id': req.params.id})
      if(film)
        return res.json(film)
      imdb.getMovie  
    } catch (error) {
      console.log(error)
    }
  }

 
//-----------user----------//
  async getFilmsByTitle(req, res) {  //search
      const title = req.body.search;
    
      if(!title)
        return res.json({messages: "Пустой запрос!"});

      try {
        const movies = await imdb.searchMovie(title);
        return res.json(movies)
      } catch (error) {
        console.log(error)
      }       
  }
 
  async wantFilms(req, res) {
    try {
      const user = await User.findOne({ login: req.params.login })
      return res.json(user.want)
    } catch (error) {
      console.log(error);
    }  
  }

  async watchedFilms(req, res) {
    try {
      const user = await User.findOne({ login: req.params.login })
      return res.json(user.watched)
    } catch (error) {
      console.log(error);
    }  
  }

  async wantFilm(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, {$push: req.body},{new: true})
      console.log(req.user)
      return res.json(user)
    } catch (error) {
      console.log(error);
    }  
  }
async unwatchFilm(req, res) {
  deleteOne
  Users_films.destroy({                                                                                                                                                     
    where:{ 
      user_id:req.user.id,
      film_id:req.body.film.id,
      status:false
      
    }
  }).then(row=>{
    postgres_logs(req.user.login,"DELETE","users_films",null);
        res.json({
          "rows_deleted":row
         });
  
  }).catch(err=>{
    
    postgres_logs(req.user.login,"DELETE","users_films",err);
      console.log(err);
          });


}

async viewedFilm(req, res) {

  Film.findByPk(req.body.film.id).then(film=>{
    postgres_logs(req.user.login,"SELECT","films",null);
    if(film)
    Users_films.findOne({
      where:{ 
        user_id:req.user.id,
        film_id:req.body.film.id
        
      }
    }).then(users_films=>{
      postgres_logs(req.user.login,"SELECT","user_films",null);
      if(!users_films){
      
        Users_films.create({
          user_id:req.user.id,
          film_id:req.body.film.id,
          status:true

        }).then(users_films=>{
          postgres_logs(req.user.login,"INSERT","user_films",users_films);
          res.json(users_films )});
      }
      else
      {
        users_films.update({status:true}).then(users_films=>{
          postgres_logs(req.user.login,"UPDATE","user_films",users_films);
          res.json(users_films )});
      }
    });
    else
    res.status(404).json({
              "error_messages":" Фильм не найден!"
           });
  }) .catch(err=>{
    postgres_logs(req.user.login,"SELECT","user_films",err);
    console.log(err);
        });
}
async unviewedFilm(req, res) {
  Users_films.destroy({                                                                                                                                                     
    where:{ 
      user_id:req.user.id,
      film_id:req.body.film.id,
      status:true
      
    }
  }).then(row=>{
    postgres_logs(req.user.login,"DELETE","user_films",null);
        res.json({
          "rows_deleted":row
         });
  
  }).catch(err=>{
      console.log(err);
          });

}
//-----------moder----------//
async addFilm(req, res) {//moder

  Film.findOrCreate({where:{ 
      "name": req.body.film.name,
      "year": req.body.film.year,
      "genre": req.body.film.genre,
      "director": req.body.film.director,
      "country": req.body.film.country,
      "poster": req.body.film.poster,
      "description": req.body.film.description


    }}).then((result)=>{
      var created=result[1];
      var film=result[0];
      console.log(film);
    if(created){
      postgres_logs(req.user.login,"INSERT","films",film);
      res.json({
        "messages":"Фильм добавлен в бд!"
  
      ,"film":film.dataValues});
      
    }
    else
    {
      postgres_logs(req.user.login,"SELECT","films",null);
        res.json({
          "messages":" Фильм уже был добавлен!"
        } );
    }
  }).catch(err=>{
    postgres_logs(req.user.login,"SELECT","films",err);
      console.log(err);
          });
        
}
async updateFilm(req, res) {//moder
  
  Film.findOne({
    where:{ 
    id:req.params.id     
    }
  }).then(film=>{
    postgres_logs(req.user.login,"SELECT","films",null);
    if(!film){
      res.status(404).json({
        "error_messages":"Не нашел фильм!"
  
      });
      
    }
    else
    {
      film.update(req.body.film).then(film=>{
        postgres_logs(req.user.login,"UPDATE","films",film);
        res.json({
          "messages":" Фильм обновлен!"
        } )});
    }
  }).catch(err=>{
    postgres_logs(req.user.login,"SELECT","films",err);
      console.log(err);
          });
        
}
async deleteFilm(req, res) {//moder
 
  Film.destroy({                                                                                                                                                     
    where:{ 
      id:req.params.id     
      }
  }).then(row=>{
    postgres_logs(req.user.login,"DELETE","films",null);
        res.json({
          "rows_deleted":row
         });
  
  }).catch(err=>{
    postgres_logs(req.user.login,"DELETE","films",err);
      console.log(err);
          });
        
}

//-----------admin----------//

  async upRating(req, res) {

    let film_id=req.body.film_id;
    let user_id=req.user.id;
    // console.log("user_id "+user_id+" film_id "+film_id);
    db.query(
       `UPDATE users_films SET rating = rating + 1 WHERE user_id = $1 AND film_id = $2 AND status=true
                          RETURNING *`
                      , [user_id,film_id]    , (err, results) => {
        if (err) {

             db.query(
            `SELECT users_films.* FROM users_films, films
             WHERE users_films.film_id=films.id AND status=true`, (err, results) => {
                if (err) {
                 throw err;
                }
                   //console.log(results.rows[0]);
                 res.json({ rating: results.rows[0].rating});
              });
            
        }
        else
        //console.log("qweqwe"+results.rows[0]);
        
        res.json({ rating: results.rows[0].rating});

  });

}
  async downRating(req, res) {

  
    let film_id=req.body.film_id;
    let user_id=req.user.id;
    db.query(
       `UPDATE users_films SET rating = rating - 1 WHERE user_id = $1 AND film_id=$2 AND status=true
                          RETURNING *`
                   , [user_id,film_id]        , (err, results) => {
        if (err) {

             db.query(
            `SELECT users_films.* FROM users_films, films
             WHERE users_films.film_id=films.id AND status=true`, (err, results) => {
                if (err) {
                 throw err;
                }

                 res.json({ rating: results.rows[0].rating});
              });
            
        }
        else
        //console.log(results.rows);
        
        res.json({ rating: results.rows[0].rating});

  });
}

async filmStatistics(req, res) {

   let film_id=req.body.film_id;
   let user_id=req.user.id;
       //console.log("film_id: "+film_id+" ser_id " +req.user.id);
    let  buff;
    let temp;
     db.query(
                  `SELECT *  FROM users_films
                   WHERE film_id=$1 AND user_id=$2 AND status=true`, [film_id, user_id],(err, results) => {
                      if (!results.rows.length>0) {
                        temp={ rating: 0};
                      }
                      else{
                        
                    
                       temp={ rating: results.rows[0].rating };
                      }
               
                      
       db.query(
                  `SELECT * FROM users_films
                   WHERE users_films.film_id=$1`, [film_id],(err, results) => {
                      if (err) {
                        res.json({ avg:null, viewed:0,watch:0});
                      }
                      else{
                           db.query(
                          `SELECT AVG(rating) AS avg, COUNT(user_id) AS viewed FROM users_films
                           WHERE users_films.film_id=$1 AND status=true`, [film_id],(err, results) => {
                              if (err) {
                                
                              }
                                    buff={avg: results.rows[0].avg, viewed: results.rows[0].viewed };

                                     db.query(
                          `SELECT  COUNT(user_id) AS watch FROM users_films
                           WHERE users_films.film_id=$1  AND status=false`, [film_id], (err, results) => {
                              if (err) {
                               throw err;
                              }
                                    // console.log(JSON.parse((JSON.stringify(temp)+JSON.stringify(buff) + JSON.stringify({watch: results.rows[0].watch })).replace(/}{/g,",")));
                                    res.json(JSON.parse((JSON.stringify(temp)+JSON.stringify(buff) + JSON.stringify({watch: results.rows[0].watch })).replace(/}{/g,",")));
                              
                            });
                               
                          });
                      }
                 });
             });
      


}
async changeStatusFilm(req, res) {

  let film_id=req.body.film_id;
  let user_id=req.user.id;
  let filmStatus=req.body.filmStatus;
  //console.log("film_id: "+film_id);
  db.query(
    `SElECT * FROM users_films
     WHERE user_id = $1 AND film_id=$2`, [user_id,film_id], (err, results) => {
      if (err) 
       throw err;
      //console.log(results.rows.length > 0&&filmStatus!=results.rows[0].status);
      if (results.rows.length > 0&&filmStatus!=results.rows[0].status) {
             db.query(
             `UPDATE users_films SET status = $3 WHERE user_id = $1 AND film_id=$2
                        RETURNING *`,
              [user_id,film_id,filmStatus], (err, results) => {
                if (err) 
                 console.log(err);

                 //console.log("1:"+results.rows[0].status);
                   res.json({status: results.rows[0].status });
                
                  });
               
      }
      else if(results.rows.length > 0){

             db.query(
        `DELETE FROM users_films
         WHERE user_id = $1 AND film_id=$2  RETURNING *`, [user_id,film_id], (err, results) => {
          if (err) 
           throw err;
          // console.log("2:"+results.rows[0].status);
         res.json({status: results.rows[0].status });
        
          });
       }
      else{
     db.query(

       `INSERT INTO users_films (user_id, film_id,status)
                  VALUES ($1, $2,$3)
                  RETURNING *`,
       [ user_id, film_id,filmStatus], (err, results) => {
          if (err) 
           console.log(err);
          //console.log("3:"+results.rows[0].status);
            res.json({status: results.rows[0].status });
          
            }
            );
      }
    }
  );
}

async checkStatusFilm(req, res) {

    let film_id=req.body.film_id;
    let user_id=req.user.id;
 //console.log(film_id+": "+user_id);
    db.query(
     `SELECT * FROM users_films
       WHERE user_id = $1 AND film_id=$2`, [user_id,film_id], (err, results) => {
        if (err) {
         throw err;
        }
       // console.log(results.rows[0].id+": "+results.rows[0].status);
         if (results.rows.length > 0) 

          res.json({status: results.rows[0].status });
        else
           res.json({ status: null});

  });

}

async getFilm(req, res) {

    let film_id=req.body.film_id;
    let user_id=req.user.id;
     db.query(
          `SEELCT FROM films
           WHERE film_id=$1 `, [film_id], (err, results) => {
            if (err) 
             throw err;
           res.json( results.rows[0]);
          
            });
}

async filmPage(req, res) {
   

    let film_id=req.params.id;
    let user_id=req.user.id;
    // console.log(film_id+": "+user_id);
    let film;
    let  buff;
    let temp;
    let stat;
    db.query(
          `SELECT * FROM films
           WHERE  id=$1 `, [film_id], (err, results) => {
            if (err) 
             throw err;

           film=results.rows[0];
          
           
    //console.log(film);

       //console.log("film_id: "+film_id+" ser_id " +req.user.id);
   
     db.query(
                  `SELECT *  FROM users_films
                   WHERE film_id=$1 AND user_id=$2 AND status=true`, [film_id, user_id],(err, results) => {
                      if (!results.rows.length>0) {
                        temp={ rating: 0};
                      }
                      else{
                        
                    
                       temp={ rating: results.rows[0].rating };
                      }
               
                      
       db.query(
                  `SELECT * FROM users_films
                   WHERE users_films.film_id=$1`, [film_id],(err, results) => {
                      if (err) {
                         stat={ avg:null, viewed:0,watch:0};
                      }
                      else{
                           db.query(
                          `SELECT AVG(rating) AS avg, COUNT(user_id) AS viewed FROM users_films
                           WHERE users_films.film_id=$1 AND status=true`, [film_id],(err, results) => {
                              if (err) {
                                
                              }
                                    buff={avg: results.rows[0].avg, viewed: results.rows[0].viewed };

                                     db.query(
                          `SELECT  COUNT(user_id) AS watch FROM users_films
                           WHERE users_films.film_id=$1  AND status=false`, [film_id], (err, results) => {
                              if (err) {
                               throw err;
                              }
                                    
                                    stat=JSON.parse((JSON.stringify(temp)+JSON.stringify(buff) + JSON.stringify({watch: results.rows[0].watch })).replace(/}{/g,","));
                               
                          
                          
                                 res.render(__dirname + "/../src/ejs/film.ejs",{ user: req.user, film: film, stat: stat });
                                         });   
                              });
                         }
                 });
           });
      });
    }


}


module.exports = new FilmsController();
