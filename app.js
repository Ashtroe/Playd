var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var passport = require('passport')
var uuid = require('uuid')
var session = require('express-session');
var MongoStore = require('connect-mongo')
var igdb = require('igdb-api-node').default;
require('./config/database')
require('./config/passport')
require('dotenv').config()


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const User = require('./models/User')

var app = express();


let results = indexRouter.results




let PORT = process.env.PORT || 5000
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

const store = new MongoStore({
  mongoUrl:process.env.DB_URL, 
  collectionName: 'sessions'
})

app.use(session({
  secret: 'secret',
  cookie: {maxAge:3600000 },
  resave:false,
  saveUninitialized: true,
  store
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
  console.log(req.session);
  next()
})





app.get('/',indexRouter)
app.get('/index',indexRouter)
app.get('/About',indexRouter)
app.get('/Account',indexRouter)
app.get('/Calendar',indexRouter)
app.get('/Discover',indexRouter)
app.get('/results',indexRouter)




app.get('/signup', usersRouter)
app.get('/login', usersRouter)
app.get('/account', usersRouter)


app.post('/signup', usersRouter)
app.post('/login', usersRouter)
app.post('/logout', usersRouter)
app.post('/user-games', usersRouter)

app.post('/search', indexRouter)
app.post('/update-status', indexRouter)
app.post('/remove-game', indexRouter)





app.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/login')
})


app.post('/results',(req,res)=>{
  res.send(results)
})


app.post('/save',(req,res)=>{
  let {title, cover, url} = req.body
  
  User.findOneAndUpdate({_id:req.session.passport.user},
    {$push: {
      savedGames: [
        {title: req.body.title,
        cover: req.body.cover,
        url: req.body.url,
        platforms: req.body.platform},
        ]
      }
    })
  .then(response=>{res.send({response})})
})

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
