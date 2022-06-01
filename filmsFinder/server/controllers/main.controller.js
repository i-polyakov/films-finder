const Film = require("../models/film");
const User = require("../models/user");

//косинусная мера 
function distCos(fUR, sUR) {//(firstUserRatings, secondUserRatings) dict
    function dotProduct(fUR, sUR){ //скалярное произведение       
        d = 0.0;
        fUR.forEach(elem => {  
            isfind = sUR.find((item) => {           
                return String(item.filmId) == String(elem.filmId);
            });   
            if (isfind) 
                d += elem.rating * isfind.rating;                
        });
        return d
    }   
    return dotProduct (fUR,sUR) / Math.sqrt(dotProduct(fUR,fUR)) / Math.sqrt(dotProduct(sUR,sUR))
}

function recommendedFilms (curentUser, allUsers, countBestSimilars, countRecommendedFilms){
    //матрица "соседей" curentUser  
    similars = [];

    // заполнение матрицы similars
    allUsers.forEach(user => {
        if(user.id != curentUser.id)
            similars.push({watched: user.watched, login: user.login, similarity: distCos(curentUser.watched, user.watched)})
    });
    //countBestSimilars наиболее похожих
    bestSimilars = similars.sort((a, b) => (a.similarity > b.similarity) ? 1 : ((b.similarity > a.similarity) ? -1 : 0))
                         .reverse()
                         .slice(0, countBestSimilars);
    //сумма мер                     
    similarsSum = 0
    bestSimilars.forEach(element => {
        similarsSum += element.similarity
    });
    //сумма калиброванных оценок по фильмам
    sum = []    
    bestSimilars.forEach(elem => {
        elem.watched.forEach(element => {
            element.rating *= elem.similarity
            sum[String(element.filmId)] ? sum[String(element.filmId)] += element.rating : sum[String(element.filmId)] = element.rating
    
        });        
    });
    //исключить фильмы которые curentUser смотрел
    curentUser.watched.forEach(element => {
        delete sum[String(element.filmId)]
    });

    recFilms = []
    for (const key in sum) {
        if (Object.hasOwnProperty.call(sum, key)) {
            recFilms.push({filmId: key, value: sum[key]/Math.abs(similarsSum)})       
        }
    }
    recFilms = recFilms.sort( (a, b) => {return a.value - b.value })
                                        .reverse()
                                        .slice(0,countRecommendedFilms)
    console.table(recFilms);
    filmId = []
    recFilms.forEach(element => {
        filmId.push(element.filmId)
    });
    
    console.log(filmId );
    return   filmId;

}
class MainController {
    
    async getTopFilms(req, res){

    }
    async getUserBasedRecommendation(req, res){
        try {
            const table = []
            const curentUser = await User.findOne({ login: req.user.login })
            const allUsers = await User.find({ },'id login watched')
           
            allUsers.forEach(element => {
                const films = {};
                element.watched.forEach(r => {
                    films[String(r.filmId).substring(String(r.filmId).length - 5)] = r.rating  
                });
                table[element.login] = films;        
            });
            console.table(table)
            const recommendation =  recommendedFilms(curentUser, allUsers, 4, 3)
            //console.log(recommendation);
            const films = await Film.find({ '_id': {$in: recommendation}})
            console.log(films)
            return res.json(films)
          } catch (error) {
            console.log(error);
          }  
    }
    async getItemBasedRecommendation(req, res){

    }
}

module.exports = new MainController();