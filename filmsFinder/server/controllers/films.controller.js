const User = require("../models/user.js");
const Film = require("../models/film.js");
const createError = require('http-errors')
const imdb = require('../services/imdb-api.js')

class FilmsController {
  async getFilmById(req, res) { //page
    try {
      const film = await Film.findOne({'imdb.id': req.params.id})
      if(film)
        return res.json(film)
      
      const response = ""//await imdb.getMovie(req.params.id) 
      if(response.errorMessage)
        return res.json({messages: response.errorMessage});
      response.save()
      return res.json(response) 
    } catch (error) {
      console.log(error)
    }
  }

//-----------user----------//
  async getFilmsByTitle(req, res) {  //search
      const title = req.body.search;
      console.log("server "+title);
      if(!title)
        return res.json({messages: "Пустой запрос!"});

      try {
        const movies = await imdb.searchMovie(title);
        return res.json(movies)
      } catch (error) {
        console.log(error)
      }       
  }
 
  async getWantFilms(req, res) {
    try {
      console.log(req.session);
      const user = await User.findOne({ login: req.params.login }).populate("want")
      if(user)
      return res.json(user.want)
    return res.json({messages: 'user not found!'})  
    } catch (error) {
      console.log(error);
    }  
  }

  async getWatchedFilms(req, res) {
    try {
      const user = await User.findOne({ login: req.params.login }).populate("watched.filmId")
      if(user)
        return res.json(user.watched)
      return res.json({messages: 'user not found!'})  
    } catch (error) {
      console.log(error);
    }  
  }

  async addWantFilm(req, res) {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {watched:{filmId: req.body.want}}
      }, { safe: true, multi:true })
      
      const user = await User.findByIdAndUpdate(req.user.id, {$addToSet: req.body},{new: true})
      return res.json(user)
    } catch (error) {
      console.log(error);
    }  
  }

  async delWantFilm(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, {$pull: {want: req.params.id}},{new: true})
      return res.json(user)
    } catch (error) {
      console.log(error);
    }  
  }

  async addWatchedFilm(req, res) {
    try {
      const response = await User.findOne({id: req.user.id, watched:{ filmId: req.body.watched.filmId}})
      console.log(response);
      if(response)
        return res.json(response)

      // const inWant = await User.findById(req.user.id, {'want': req.body.watched.id})
      // if(!inWant)
      //   return res.json( await User.findByIdAndUpdate(req.user.id, {$addToSet: req.body},{new: true}))
      
      const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {want: req.body.watched.filmId},
        $addToSet: req.body
      },{new: true})
      return res.json(user)    
      
    } catch (error) {
      console.log(error);
    }  
  }
  async delWatchedFilm(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, {
        $pull: {watched:{filmId: req.params.id}}
      }, { safe: true, multi:true, new: true })
      return res.json(user)
    } catch (error) {
      console.log(error);
    }  
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
