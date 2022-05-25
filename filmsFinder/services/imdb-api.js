const axios = require('axios');
const Film = require("../models/film.js");
const baseUrl = 'https://imdb-api.com/ru/API/'
apiKey = 'k_g9eym8du'

module.exports.searchMovie = async function(title, res){
    try {      
        const response = await axios.get(encodeURI(baseUrl+'SearchMovie/'+apiKey+'/'+title))  
        return response.data.results
    } catch (error) {
        console.log(error)
    }  
}
module.exports.getMovie = async function(id, res){
    try {      
        const response = await axios.get(encodeURI(baseUrl+'Title/'+apiKey+'/'+id)) 
        console.log(response.data)
        if(response.data.errorMessage)
            return {errorMessage: response.data.errorMessage}

        const film = new Film({
            title: response.data.title,
            year: response.data.year,
            released: response.data.releaseDate,
            runtime: response.data.runtimeStr,
            image: response.data.image,
            plot: response.data.plotLocal,
            directors: Array.from(response.data.directorList, (director) => { return director.name}),
            writers: Array.from(response.data.writerList, (writer) => { return writer.name}),
            actors: Array.from(response.data.actorList, (actor) => { return actor.name}),
            genres: Array.from(response.data.genreList, (genre) => { return genre.value}),
            countries: Array.from(response.data.countryList, (country) => { return country.value.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');}),
            imdb:{
                rating: response.data.imDbRating,
                votes: Number(response.data.imDbRatingVotes),
                id: response.data.id
            },
            contentRating: response.data.contentRating,
            metacriticRating: Number(response.data.metacriticRating)
        });
        console.log(film)
        return film
    } catch (error) {
        console.log(error)
    }  
}