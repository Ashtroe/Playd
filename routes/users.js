var express = require('express');
var router = express.Router();
const User = require('../models/User')
const passport = require('passport')
const genPassword = require('../config/passwordUtils').genPassword
const validatePass = require('../config/passwordUtils').validatePass
const isAuth = require('../config/authMiddleware').isAuth

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
    hash:hash,
    salt:salt
  })
  newUser.save()
  .then(user=>console.log(user))
  .catch(err=>console.log(err))

    res.redirect('/login')
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/account',(req,res)=>{
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
  res.redirect('/login')
})

router.get('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/login')
})

router.post('/user-games', isAuth, (req,res)=>{

  User.find({_id:req.session.passport.user})
    .then(response=>{
      console.log(response[0].savedGames);
      res.send(response[0].savedGames)
    })
})

module.exports = router
