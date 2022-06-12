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
            if (isfind && elem.rating && isfind.rating)
                d += elem.rating * isfind.rating;                
        });
        return d
    }   
    return dotProduct (fUR,sUR) / Math.sqrt(dotProduct(fUR,fUR)) / Math.sqrt(dotProduct(sUR,sUR))
}
// Возвращает коэффициент корреляции Пирсона между user1 и user2
function PearsonCorrelationCoefficient(u1, u2){//Pearson correlation coefficient
    //список фильмов, оцененных обоими
    const filmsId = []
    //Суммы оценок фильмов
    sum1 = 0;
    sum2 = 0;
    //Cуммы квадратов
    sum1Pow = 0;
    sum2Pow = 0;
    //сумма произведений
    sumM = 0;
    //Получить список фильмов, оцененных обоими
    u1.watched.forEach(filmU1 => {
        isfind = u2.watched.find(filmU2 => {           
            return (String(filmU1.filmId) == String(filmU2.filmId) && filmU1.rating && filmU2.rating );
        });
        //Если фильм найден, то вычислить суммы оценок фильмов, суммы квадратов и сумму произведений
        if (isfind){
            filmsId.push(isfind.filmId);   

            sum1 += filmU1.rating;
            sum2 += isfind.rating;

            sum1Pow += filmU1.rating**2;
            sum2Pow += isfind.rating**2;

            sumM += filmU1.rating * isfind.rating;
        }      
    });
   
    //Если нет ни одной общей оценки, вернуть 0
    if(filmsId.length<5)
        return 0;
    //Вычислить коэффициент Пирсона
    n = filmsId.length;    
    numerator = n * sumM  - sum1 * sum2
    denominator = (n * sum1Pow - sum1**2)**(1/2) * (n * sum2Pow - sum2**2)**(1/2)
    if(!denominator)
        return 0;  
    r = numerator/denominator      
    console.log(r);
    return n<100?r*(1+(1-r*r)/(2*(n-3))):r; 
}
// function similarUser2(u1, u2){
//     //список фильмов, оцененных обоими
//     const filmsId = []
//     //Суммы оценок фильмов
//     sum1 = 0;
//     sum2 = 0;
//     //Cуммы квадратов
//     sum1Pow = 0;
//     sum2Pow = 0;
//     //сумма произведений
//     sumM = 0;
//     //Получить список фильмов, оцененных обоими
//     srd1 = 0 ;
//     i1 = 0;
//     i2 = 0;
//     srd2 = 0;
//     u1.watched.forEach(film => {
//         if(film.rating){
//             srd1 += film.rating;
//             i1++;
//         }
//     });
//     u2.watched.forEach(film => {
//         if(film.rating){
//             srd2 += film.rating;
//             i2++;
//         }
          
//     });
//     if(i1)
//         srd1 /= i1
//     if(i2)
//         srd2 /= i2    
//     //console.log("srd: ",srd1,srd2);
//     u1.watched.forEach(filmU1 => {
//         isfind = u2.watched.find(filmU2 => {           
//             return (String(filmU1.filmId) == String(filmU2.filmId) && filmU1.rating && filmU2.rating );
//         });
//         //Если фильм найден, то вычислить суммы оценок фильмов, суммы квадратов и сумму произведений
//         if (isfind){
//             filmsId.push(isfind.filmId);   

//             sum1 += filmU1.rating;
//             sum2 += isfind.rating;

//             sum1Pow += (filmU1.rating - srd1)**2;
//             sum2Pow += (isfind.rating - srd2)**2;

//             sumM += (filmU1.rating - srd1) * (isfind.rating - srd2) ;
//         }      
//     });
//     //Если нет ни одной общей оценки, вернуть 0
//     if(!filmsId.length)
//         return 0;
//     //Вычислить коэффициент Пирсона
//     n = filmsId.length;    
//     denominator = (sum1Pow)**(1/2) * (sum2Pow)**(1/2)
//     if(!denominator)
//         return 0;    
//     return sumM / denominator; 
// }

// Возвращает список наилучших соответствий для человека из словаря
// Количество результатов в списке и функция подобия – необязательные параметры.
function getBestSimilars(curentUser, allUsers, countBestSimilars = 5, similarity = PearsonCorrelationCoefficient){
    similars = [];
    allUsers.forEach(user => {
        if(user.id != curentUser.id){
            coefficient = PearsonCorrelationCoefficient(curentUser, user)
            //Если  коэффициент корреляции значимый
            if ( coefficient > 0.5) 
                similars.push({coefficient, user})
        }
            
    });
    //Вернуть отсортированный список по убыванию оценок 
    return similars.sort((a, b) => a.coefficient - b.coefficient)
    .reverse()
    .slice(0, countBestSimilars);
}
function recommendedFilms(curentUser, allUsers, countBestSimilars, countRecommendedFilms, metric = "distCos" ){
    //матрица "соседей" curentUser  
    allUsers.forEach(user => {
        if(user.id != curentUser.id)
            console.log(user.login+": " + distCos(curentUser.watched, user.watched)+" "+ PearsonCorrelationCoefficient(curentUser, user))
    });

    //Список наилучших соответствий
    bestSimilars = getBestSimilars(curentUser, allUsers, countBestSimilars)
    console.log(bestSimilars);
    // //сумма мер                     
    // similarsSum = 0
    // bestSimilars.forEach(element => {
    //     coefficient += element.coefficient
    // });
    //сумма калиброванных оценок по фильмам
    sum = []    
    bestSimilars.forEach(elem => {
        elem.user.watched.forEach(film => {
            item = sum[String(film.filmId)]
            if(item){
                item.sumRating += film.rating * elem.coefficient
                item.sumCoefficient += elem.coefficient
            }
            else
                sum[String(film.filmId)] = {
                    sumRating: film.rating * elem.coefficient, 
                    sumCoefficient: elem.coefficient
                }

        });        
    });
    //исключить фильмы которые curentUser смотрел или хочет посмотреть
    curentUser.watched.forEach(element => {
        delete sum[String(element.filmId)]
    });
    curentUser.want.forEach(element => {
        delete sum[String(element)]
    });

    recFilms = []
    for (const key in sum) 
        if (Object.hasOwnProperty.call(sum, key)) 
            recFilms.push({
                filmId: key, 
                value: sum[key].sumRating/sum[key].sumCoefficient
            })            
    
    recFilms = recFilms.sort((a, b) => a.value - b.value ).reverse().slice(0,countRecommendedFilms)
    console.table(recFilms);
    
    //console.log(filmId );
    return   recFilms.map(item => item.filmId);
}
class MainController {
    
    async getTopFilms(req, res){
      try {
        const users = await User.find().populate("watched.filmId")
        const films = []
        const count  = []
        users.forEach(elem => {
            elem.watched.forEach(element => {
                if (element.filmId) {
                    if( films[String(element.filmId.id)]){
                        films[String(element.filmId.id)] += element.rating
                        count[String(element.filmId.id)] += 1
        
                       }
                       else{
                        films[String(element.filmId.id)] = element.rating
                        count[String(element.filmId.id )] = 1
                       }
                }
              
            
            });
        });
        const arr = []
        for (const key in films) {
            if (Object.hasOwnProperty.call (films, key)) 
                    arr.push({ key, avg:  films[key] /= count[key]});              
        }
        const topFilms = arr.sort( (a, b) => {return a.avg - b.avg })
                        .reverse()
                        .slice(0,req.params.count);
        const topFilmsId = []
        topFilms.forEach(element => {
            topFilmsId.push(element.key)
        });  
        console.log(topFilmsId);      
        const top = await Film.find({ '_id': {$in: topFilmsId}})
        //console.log(top)
        return res.json(top)
        } catch (error) {
            console.log(error);
        }  
      
    }
    async getUserBasedRecommendation(req, res){
        try {
            const table = []
            const curentUser = await User.findOne({ login: req.body.user.login })
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
            //console.log(curentUser);
            const films = await Film.find({ '_id': {$in: recommendation}})
            //console.log(films)
            return res.json(films)
          } catch (error) {
            console.log(error);
          }  
    }
    async getItemBasedRecommendation(req, res){

    }
}

module.exports = new MainController();