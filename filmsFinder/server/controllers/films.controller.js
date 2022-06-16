const User = require("../models/user.js");
const Film = require("../models/film.js");
const imdb = require('../services/imdb-api.js')

class FilmsController {
  async getFilmById(req, res) { //page
    try {
      const film = await Film.findOne({'imdb.id': req.params.id})
      if(film)
        return res.json(film)
      
      const response = await imdb.getMovie(req.params.id) 
      if(response.errorMessage)
        return res.json({messages: response.errorMessage});
      response.save()
      return res.json(response) 
    } catch (error) {
      console.log(error)
    }
  }

  async getStatFilmById(req, res) { 
    try {    
      let film = await Film.findOne({'imdb.id': req.params.id})
      if(!film){
        film = await imdb.getMovie(req.params.id) 
        if(film.errorMessage)
          return res.json({messages: response.errorMessage});
        film.save()
      }
    
      const stat = {}
      const users = await User.find().populate("watched.filmId")
      let sum = 0
      let count = 0
      let countWatched = 0
      let countWant = 0
      users.forEach(user => {
        user.want.forEach(element => {
         
          if(String(element) === String(film._id))
            countWant ++                  
        });
        user.watched.forEach(element => {
            if(String(element.filmId.id) === String(film._id)){
              
              countWatched ++
              if (element.rating) {
                sum += element.rating
                count += 1
              }
            }            
        });
      });
      stat.avg = count?sum/count: count
      stat.watched = countWatched
      stat.want = countWant
      console.log (stat)
      return res.json(stat)
    } catch (error) {
      console.log(error)
    }
  }

  async getReviewsFilmById(req, res) { 
    try {
      let film = await Film.findOne({'imdb.id': req.params.id})
      if(!film){
        film = await imdb.getMovie(req.params.id) 
        if(film.errorMessage)
          return res.json({messages: response.errorMessage});
        film.save()
      }
      const reviews = []
      const users = await User.find().populate("watched.filmId")
      let sum = 0
      let count = 0
      let countWatched = 0
      let countWant = 0
      users.forEach(user => {
        user.watched.forEach(element => {
            if(String(element.filmId.id) === String(film._id)){
              reviews.push( {
              _id:user._id,
              login: user.login,
              rating: element.rating,
              review: element.review 
              })
            }   
        });
      });
     
      console.log (reviews)
      return res.json(reviews)
      
     
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
      //console.log(req.body.user);
      //удалить из watched
      await User.findByIdAndUpdate(req.body.user._id, {
        $pull: {watched:{filmId: req.body.want}}
      }, { safe: true, multi:true })
      //добавить
      const user = await User.findByIdAndUpdate(req.body.user._id, {$addToSet: {want: req.body.want}},{new: true})
      //console.log(user);
      return res.json(user)
    } catch (error) {
      console.log(error);
    }  
  }

  async delWantFilm(req, res) {
    try {
      //console.log(req.body);
      const user = await User.findByIdAndUpdate(req.body.user._id, {$pull: {want: req.params.id}},{new: true})
      //console.log(user);
      return res.json(user)
    } catch (error) {
      console.log(error);
    }  
  }

  async addWatchedFilm(req, res) {
    try {
      //если фильм уже был добавлен
      const response = await User.findOne({ _id:req.body.user._id, "watched.filmId": req.body.watched.filmId})
      //console.log(response);
      if(response)
        return res.json(response)

      // const inWant = await User.findById(req.user.id, {'want': req.body.watched.id})
      // if(!inWant)
      //   return res.json( await User.findByIdAndUpdate(req.user.id, {$addToSet: req.body},{new: true}))
      
      const user = await User.findByIdAndUpdate(req.body.user._id, {
        $pull: {want: req.body.watched.filmId},
        $addToSet: {watched: req.body.watched}
      },{new: true})
      console.log(user);
      return res.json(user)    
      
    } catch (error) {
      console.log(error);
    }  
  }
  async delWatchedFilm(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.body.user._id, {
        $pull: {watched:{filmId: req.params.id}}
      }, { safe: true, multi:true, new: true })
      return res.json(user)
    } catch (error) {
      console.log(error);
    }  
  }
}

module.exports = new FilmsController();
