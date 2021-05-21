var express = require('express');
var router = express.Router();
const User = require('../models/User')
const passport = require('passport')
const genPassword = require('../config/passwordUtils').genPassword
const validatePass = require('../config/passwordUtils').validatePass
const isAuth = require('../config/authMiddleware').isAuth
const SteamAPI = require('steamapi');
var igdb = require('igdb-api-node').default;
const { DateTime } = require("luxon");


let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let ACCESS_TOKEN = process.env.ACCESS_TOKEN
let STEAM_KEY = process.env.STEAM_KEY
const steam = new SteamAPI(STEAM_KEY);

var newFormat = delete DateTime.DATETIME_MED.time

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.post('/signup',(req,res)=>{

  let saltHash = genPassword(req.body.password)
  let salt = saltHash.salt
  let hash = saltHash.hash

  let newUser = new User({
    username:req.body.username,
    email:req.body.email,
    image:req.body.image,
    hash:hash,
    salt:salt
  })
  newUser.save()
  .then(user=>console.log(user))
  .catch(err=>console.log(err))

    res.redirect('/login')
})

router.get('/login',(req,res)=>{
    res.render('Login')
})

router.get('/account',isAuth,(req,res)=>{
    User.find({_id:req.session.passport.user})
    .then((response)=>{
      console.log(response);
      res.render('account',{user:response[0]})
    })
})

router.post('/login',passport.authenticate('local'),(req,res)=>{
  res.redirect('/')
})

router.post('/logout',(req,res)=>{
  req.logOut()
  req.session.destroy(function (err) {
    res.redirect('/')
})
})



router.post('/user-games', isAuth, (req,res)=>{

  User.find({_id:req.session.passport.user})
    .then(response=>{
      console.log(response[0].savedGames);
      res.send(response[0].savedGames)
    })
})

router.post('/steamID',(req,res)=>{

  User.find({_id:req.session.passport.user})
  .then(response=>{
    steam.resolve(`https://steamcommunity.com/id/${response[0].steamName}`)
    .then(id=>{
      let steamInfo = steam.getUserRecentGames(id)
      return steamInfo
    })
    .then(steamInfo => {
      
      steamInfo.forEach(steamGame=>{
        
        // Convert game to IGDB 
        igdb(CLIENT_ID, ACCESS_TOKEN)
          .fields(['name, websites.*, cover.*,platforms.*,*'])
          .search(steamGame.name)
          .request('/games')
          .then(response=>{
            response.data.forEach((game,i)=>{
              
              if((typeof(game.websites) != 'undefined') && game.websites.some(obj => obj.url.includes(steamGame.appID))){
                
                // Check if game already exists 
                User.findOne({_id:req.session.passport.user})
                .then((response)=>{
                  if (response.savedGames.find(obj=> obj.title === game.name)){
                    console.log(`"${game.name}" is already added to account`);
                  }else{
                     // Add games to User
                 User.findOneAndUpdate({_id:req.session.passport.user},
                  {$push: {
                    savedGames: [{
                      title: game.name,
                      cover:`//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpeg`,
                      category: game.genres[0].name,
                      platforms: game.platforms,
                      totalPlaytime: {
                        lastUpdated: DateTime.now().toLocaleString(DateTime.newFormat),
                        time:Math.floor(steamGame.playTime/60)
                      }
                      }]
                    }
                  })
                  .then(response=>console.log(response.savedGames))
                  }
                })
                
                .catch(err=>console.log(err))
              }
            })
          })
      })
    })
    .then((response)=>res.send(response))
    .catch(err=>console.log(err))
  })
      })



module.exports = router
