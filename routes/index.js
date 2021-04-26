var express = require('express');
var router = express.Router();

var igdb = require('igdb-api-node').default;

const passport = require('passport')
const database = require('../config/database')
const User = require('../models/User')

const isAuth = require('../config/authMiddleware').isAuth

let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let ACCESS_TOKEN = process.env.ACCESS_TOKEN

let results
/* GET home page. */
router.get('/', isAuth, (req,res, next)=>{
    res.render('index',{user:req.user.username})
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
  
  router.get('/Discover', (req,res, next)=>{
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
    .fields(['name,cover.*,*'])
    .limit(20)
    .search(game)
    .where('category=0 & cover!=null & version_title = null')
    .request('/games')
      .then(response=>{
        results = response.data;
        res.send(results)})
      .catch(err=>console.log(err.response))
  })
module.exports = router;
