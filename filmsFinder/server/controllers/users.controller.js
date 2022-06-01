const User = require("../models/user.js");

class UsersController {
    //-----------admin----------//
    async getUsersByLogin(req, res) {  //search
        try {      
            const users = await User.find({login: {$regex: req.body.login, $options: 'ix'} })
            return res.json(users)
        } catch (error) {
            console.log(error);
        }
    }
    async getUsersByRole(req, res) {  //search
        try {
            const users = await User.find({role: req.body.role })
            return res.json(users)
        } catch (error) {
            console.log(error);
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
            console.log(error);
        }
       
    }
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete(
                {login: req.params.login})
            return res.json(user)
        } catch (error) {
            console.log(error);
        }
    }
    async followUser(req, res) {
        try {
            const fUser = await User.findOne({login: req.params.login})
            if(!fUser)
                return res.json({messages: 'user not found!'})  
            const user = await User.findByIdAndUpdate(req.user.id, {
                $addToSet: {following: fUser.id}
            },{new: true})
            return res.json(user)
        } catch (error) {
            console.log(error);
        }
    } 
    async unFollowUser(req, res) {
        try {
            const fUser = await User.findOne({login: req.params.login})
            if(!fUser)
                return res.json({messages: 'user not found!'})  
            const user = await User.findByIdAndUpdate(req.user.id, {
                $pull: {following: fUser.id}
            },{new: true})
            return res.json(user)
        } catch (error) {
            console.log(error);
        }
    } 
    async getFollowing(req, res) {
        try {
          const user = await User.findOne({ login: req.params.login })
          if(user)
            return res.json(user.following)
        return res.json({messages: 'user not found!'})  
        } catch (error) {
          console.log(error);
        }  
      }
      async getFollowers(req, res) {
        try {
          const user = await User.findOne({ login: req.params.login })
          if(user)
            return res.json(user.followers)
        return res.json({messages: 'user not found!'})  
        } catch (error) {
          console.log(error);
        }  
      }
    
}
module.exports = new UsersController();