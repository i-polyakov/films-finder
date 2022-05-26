const User = require("../models/user.js");

class UsersController {
    //-----------admin----------//
    async getUsersByLogin(req, res) {  //search
        try {
            const users = User.find({login:{ $regex: req.body.login, $options: "i" }})
            return res.json(users)
        } catch (error) {
            console.log(err);
        }
    }
    async getUsersByRole(req, res) {  //search
        try {
            const users = User.find({role: req.body.role })
            return res.json(users)
        } catch (error) {
            console.log(err);
        }
    }
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {login: req.params.login},
                {$addToSet: req.body},
                {new: true})
            return res.json(user)
        } catch (error) {
            console.log(err);
        }
       
    }
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete(
                {login: req.params.login})
            return res.json(user)
        } catch (error) {
            console.log(err);
        }
    }
      
}
module.exports = new UsersController();