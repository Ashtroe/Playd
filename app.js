var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var mongoose = require('mongoose')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var session = require('cookie-session');
var igdb = require('igdb-api-node').default;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { response } = require('express');
const User = require('./models/User')

var app = express();
let CLIENT_ID = 'kcw4vwmo8hu9538kixcsq95b67vxe4'
let CLIENT_SECRET = '4p3hrexqzcudu9nc6y9vawwuqagaw0'
let ACCESS_TOKEN = 'l7bv3v5hnvze1lb6ynlucuoatw05d9'

let results

let covers = []


let PORT = process.env.PORT || 5000
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());


let validateCookie = (req,res,next ) =>{
  let { cookies } = req
  if('session_id' in cookies){
    if(cookies.session_id === '1234'){
      next()
    }else{
      res.status(403).send('Not Authenticated').sendFile(__dirname + '/views/login.html')
    }
  }else{
    console.log(req);
    res.status(403).sendFile(__dirname + '/views/login.html')
  }
}


// Connect to Mongo 
mongoose.connect('mongodb+srv://Ashtroe:Design0129@playd.hswqk.mongodb.net/Playd?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongo connected');
});


app.get('/', validateCookie, (req,res, next)=>{
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/login', (req,res, next)=>{
  res.sendFile(__dirname + '/views/login.html')
})


app.post('/search', validateCookie, (req,res)=>{
  let game = req.body.search
  
  igdb(CLIENT_ID, ACCESS_TOKEN)
  .fields(['name,cover.*,url'])
  .limit(20)
  .search(game)
  .request('/games')
    .then(response=>{
      results = response.data;
      res.send('success')})
    .catch(err=>console.log(err.response))
})

app.get('/results',(req,res)=>{
  res.sendFile(__dirname + '/views/results.html')
})

app.post('/results',(req,res)=>{
  res.send(results)
})





app.post('/login', (req,res,next)=>{
  passport.authenticate('local', (err,user,info)=>{
      req.logIn(user,err =>{
        if(err){
          res.status(403).send('Incorrect login info')
        }else{
          res.cookie('session_id','1234')
          res.status(200).send('Logged in')

        }
      })
  })
  (req,res,next)
})

app.post("/signup", (req, res, next) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password
  }).save(err => {
    if (err) {
      return next(err);
    };
    
    res.send("user created");
  })
})


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      };
      if (!user) {
        return done(null, false, { msg: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { msg: "Incorrect password" });
      }
      return done(null, user);
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById({_id:id}, function(err, user) {
    done(err, user);
  });
});

app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`);
})
module.exports = app;
