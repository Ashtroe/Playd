var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var passport = require('passport')
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose')
var MongoStore = require('connect-mongo')
var session = require('express-session');
var igdb = require('igdb-api-node').default;
const isAuth = require('./config/authMiddleware').isAuth
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const scheduler = new ToadScheduler()
const { DateTime } = require("luxon");
const SteamAPI = require('steamapi');

require('./config/passport')
require('dotenv').config()

let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let ACCESS_TOKEN = process.env.ACCESS_TOKEN
let STEAM_KEY = process.env.STEAM_KEY
const steam = new SteamAPI(STEAM_KEY);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const User = require('./models/User')

var app = express();


let results = indexRouter.results

let now = DateTime.local()
var newFormat = delete DateTime.DATETIME_MED.time
let yesterday = now.minus({days:1}).toLocaleString(DateTime.newFormat)




let PORT = process.env.PORT || 5000

// Connect to Mongo 
mongoose.connect(process.env.MONGODB_URI , {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongo connected');
});

const mongo = new MongoClient(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 



app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  cookie: {maxAge:5.184e9 },
  resave:false,
  saveUninitialized: true,
  store: MongoStore.create({clientPromise: mongo.connect()  , collectionName: 'sessions'})
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.get('/',indexRouter)
app.get('/index',indexRouter)
app.get('/about',indexRouter)
app.get('/account',indexRouter)
app.get('/calendar',indexRouter)
app.get('/discover',indexRouter)
app.get('/results',indexRouter)
app.get('/game/:game', indexRouter)

app.post('/search', indexRouter)
app.post('/calendar', indexRouter)
app.post('/discover', indexRouter)
app.post('/update-status', indexRouter)
app.post('/remove-game', indexRouter)



app.get('/signup', usersRouter)
app.get('/login', usersRouter)
app.get('/account', usersRouter)


app.post('/signup', usersRouter)
app.post('/login', usersRouter)
app.post('/logout', usersRouter)
app.post('/user-games', usersRouter)
app.post('/steamID', usersRouter)






app.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/login')
})


app.post('/results',(req,res)=>{
  res.send(results)
})


app.post('/save',(req,res)=>{
  
  User.findOneAndUpdate({_id:req.session.passport.user},
    {$push: {
      savedGames: [{
        title: req.body.title,
        cover: req.body.cover,
        url: req.body.url,
        category: req.body.category,
        platforms: req.body.platforms,
        playTime: req.body.playTime
        }]
      }
    })
  .then(response=>{res.send({response})})
})

// Find user games and compare total playtime with Steam 
let checkPlaytime = () => {
  User.find({})
  .then(response=>{
    response.forEach(user=>{
      if(user.steamName){
        steam.resolve(`https://steamcommunity.com/id/${user.steamName}`)
        .then(id=>{
          steam.getUserRecentGames(id)
        .then(steamInfo=>{
          steamInfo.forEach(steamGame=>{
            let userGameID = (user.savedGames.find(game=>game.title.toLowerCase() === steamGame.name.toLowerCase()))._id
            let userGameTime = (user.savedGames.find(game=>game.title.toLowerCase() === steamGame.name.toLowerCase())).totalPlaytime.time
            let steamGameTime = Math.floor(steamGame.playTime / 60)
            let steamTitleFormatted = steamGame.name.toLowerCase()
            if(steamGameTime > userGameTime ){
            
              User.findOneAndUpdate(
                {'_id':user._id,
               'savedGames._id': userGameID},
                {$set: { 'savedGames.$.playTime.0': {'date':yesterday,'time':(steamGameTime - userGameTime)}} },
                {upsert: true, new: true}
                )
                .then(response=>{
                  console.log(response.savedGames[0].playTime[0])
                })
                .catch(err=>console.log(`Error: ${err}`))
              
            }else{
              User.findOneAndUpdate(
                {'_id':user._id,
               'savedGames._id': userGameID},
                {$set: { 'savedGames.$.playTime.0': {'date':yesterday,'time':0}} },
                {upsert: true, new: true}
                )
                .then(response=>{
                  console.log(response.savedGames[0].playTime[0])
                })
                .catch(err=>console.log(`Error: ${err}`))
            }
          })
        })
      })
    }})
  })
}

let task = new Task(
  'simple task',
  ()=>{checkPlaytime()}
)
const job = new SimpleIntervalJob({ seconds: 43200, }, task)
scheduler.addSimpleIntervalJob(job)



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 
});



app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`);
})
module.exports = app;
