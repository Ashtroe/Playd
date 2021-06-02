var express = require('express');
var router = express.Router();

var igdb = require('igdb-api-node').default;
var _ = require('lodash');
const { DateTime } = require("luxon");
const passport = require('passport')

const User = require('../models/User')

const isAuth = require('../config/authMiddleware').isAuth

let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let ACCESS_TOKEN = process.env.ACCESS_TOKEN
let STEAM_KEY = process.env.STEAM_KEY

let results
let today = DateTime.now().toSeconds()
let jan = DateTime.local(2021, 1, 1).toSeconds()
let feb = DateTime.local(2021, 2, 1).toSeconds()
let mar = DateTime.local(2021, 3, 1).toSeconds()
let apr = DateTime.local(2021, 4, 1).toSeconds()
let may = DateTime.local(2021, 5, 1).toSeconds()
let jun = DateTime.local(2021, 6, 1).toSeconds()
let jul = DateTime.local(2021, 7, 1).toSeconds()
let aug = DateTime.local(2021, 8, 1).toSeconds()
let sep = DateTime.local(2021, 9, 1).toSeconds()
let oct = DateTime.local(2021, 10, 1).toSeconds()
let nov = DateTime.local(2021, 11, 1).toSeconds()
let dec = DateTime.local(2021, 12, 1).toSeconds()


router.use(isAuth)

/* GET home page. */
router.get('/home',(req,res)=>{
   res.render('home',{user:req.user})
  })

  
  router.get('/calendar',  (req,res, next)=>{

    res.render('Calendar',{user:req.user})
  })
  
  router.get('/news', (req,res, next)=>{
    res.render('News',{user:req.user})
  })
  
  let getUser = (req,res,next) => {
    User.findOne({_id:req.session.passport.user},((err,user)=>{
      if(err){
        console.log(err)
        next()
      }else{
        req.user = user
        
      }

    }))
      next()
      
  }

  router.get('/discover', (req,res, next)=>{
                res.render('Discover',{user:req.user})
  })



  router.post('/remove-game',(req,res)=>{
    console.log(req.session.passport.user);

    User.findOneAndUpdate(
      {'_id':req.session.passport.user},
      {$pull: {savedGames: {'_id': req.body.gameID}} },
      )
      .then(response=>{
        console.log(response)
        res.send(`${req.body.gameID} removed`)
      })
      .catch(err=>console.log(err))
  })

  router.post('/search', (req,res)=>{
    let game = req.body.search
    
    igdb(CLIENT_ID, ACCESS_TOKEN)
    .fields(['name,cover.*,genres.*,involved_companies.*, platforms.*, websites.*, *'])
    .limit(40)
    .search(game)
    .where('category=0 & cover!=null ')
    .request('/games')
      .then(response=>{
        results = response.data;
        res.send(results)})
      .catch(err=>console.log(err.response))
  })

  router.post('/calendar',(req,res)=>{
      igdb(CLIENT_ID, ACCESS_TOKEN)
      .fields('*, game.name, game.cover.*, game.genres.*')
      .where(`date>=${jan-1} & date<${dec - 1} & game.category = 0 & game.hypes != null & game.cover != null`)
      .limit(500)
      .request('/release_dates')
        .then(response=>{
          sortedData = _.uniqBy(response.data,'game.name');
          
          res.send(sortedData)})
        .catch(err=>console.log(err.response))
  })

  router.post('/discover',(req,res)=>{
    // Find upcoming games with hype over 20 
    igdb(CLIENT_ID, ACCESS_TOKEN)
      .fields('*, game.*, game.cover.*')
      .where(`date>=${jan} & date<=${today} &  game.rating_count >=50 & game.rating >= 75`)
      .limit(10)
      .request('/release_dates')
        .then(response=>{
          sortedData = _.uniqBy(response.data,'game.name');
          
          res.send(sortedData)})
        .catch(err=>console.log(err.response))
  })

  // Individual game info 
  router.get('/game/:game',(req,res)=>{
    igdb(CLIENT_ID, ACCESS_TOKEN)
      .fields('*')
      .where(`id = ${req.params.game}`)
      .request(`/games`)
      .then(response=>{
        res.send(response.data);
      })
      .catch(err=>console.log(err))
  })
module.exports = router;
