const User = require("../models/user");

//косинусная мера 
function distCosine(fUR, sUR) {//(firstUserRatings, secondUserRatings) dict
    function dotProduct(fUR, sUR){ //скалярное произведение       
    d = 0.0;
    fUR.forEach(elem => {  
        isfind = sUR.find((item) => {           
            return String(item.filmId) == String(elem.filmId);
        });   
        if (isfind){  
            d += elem.rating * isfind.rating;
        }          
    });
   
    return d
 
    }   
    return dotProduct (fUR,sUR) / Math.sqrt(dotProduct(fUR,fUR)) / Math.sqrt(dotProduct(sUR,sUR))
}

function makeRecommendation (curentUser, allUsers, countBestSimilars, nBestProducts){
    similars = [];//матрица "похожести" curentUser и allUsers 
    allUsers.forEach(user => {
        if(user.id != curentUser.id)
            similars.push({id: user.id, login: user.login, similarity: distCosine(curentUser.watched, user.watched)})
    });
    
    bestSimilars = similars.sort((a, b) => (a.similarity > b.similarity) ? 1 : ((b.similarity > a.similarity) ? -1 : 0))
                         .reverse()
                         .slice(0, countBestSimilars);                    
    bestSimilars.forEach(element => {
        console.log(element);
    });                        
    // sim = dict()
    // sim_all = sum([x[1] for x in bestMatches])
    // bestMatches = dict([x for x in bestMatches if x[1] > 0.0])        
    // for relatedUser in bestMatches:
    //     for product in userRates[relatedUser]:
    //         if not product in userRates[userID]:
    //             if not product in sim:
    //                 sim[product] = 0.0
    //             sim[product] += userRates[relatedUser][product] * bestMatches[relatedUser]
    // for product in sim:
    //     sim[product] /= sim_all
    // bestProducts = sorted(sim.iteritems(), key=lambda(x,y):(y,x), reverse=True)[:nBestProducts]
    // print "Most correlated products:"
    // for prodInfo in bestProducts:    
    //     print "  ProductID: %6s  CorrelationCoeff: %6.4f" % (prodInfo[0], prodInfo[1])
    // return [(x[0], x[1]) for x in bestProducts]
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
            makeRecommendation(curentUser,allUsers,4,0)
            return res.json("")
          } catch (error) {
            console.log(error);
          }  
    }
    async getItemBasedRecommendation(req, res){

    }
}

module.exports = new MainController();