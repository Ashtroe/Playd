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

/* GET home page. */
router.get('/', isAuth, (req,res, next)=>{

    res.render('index',{user:req.user})
  })



  router.get('/index', (req,res, next)=>{
    res.render('index')
  })
  
  router.get('/calendar',  (req,res, next)=>{
    res.render('calendar')
  })
  
  router.get('/news', (req,res, next)=>{
    res.sendFile(__dirname + '/views/news.html')
  })
  
  router.get('/discover', (req,res, next)=>{
    res.render('discover')
  })

  router.get('/results', (req,res, next)=>{
    console.log(results);
    res.render('results',{results:results})
  })


  router.post('/update-status',(req,res)=>{
    console.log(req.session.passport.user);

    User.findOneAndUpdate(
      {'_id':req.session.passport.user,
      'savedGames._id':req.body.gameID},
      {$set: {'savedGames.$.isCompleted':true} },
      )
      .then(response=>console.log(response))
      .catch(err=>console.log(err))
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
      .fields('*, game.name')
      .where(`date>=${may} & date<${dec - 1} & game.category = 0 & game.hypes != null & game.cover != null`)
      .limit(200)
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
