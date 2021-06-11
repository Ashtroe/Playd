var express = require("express");
var router = express.Router();
const User = require("../models/User");
const passport = require("passport");
var bcrypt = require('bcrypt')
const genPassword = require("../config/passwordUtils").genPassword;
const { check, body, validationResult } = require("express-validator");
var flash = require("connect-flash");
const isAuth = require("../config/authMiddleware").isAuth;
const SteamAPI = require("steamapi");
var igdb = require("igdb-api-node").default;
const { DateTime } = require("luxon");

let CLIENT_ID = process.env.CLIENT_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;
let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
let STEAM_KEY = process.env.STEAM_KEY;
const steam = new SteamAPI(STEAM_KEY);

var newFormat = delete DateTime.DATETIME_MED.time;

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post(
  "/signup",
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength(4)
    .withMessage("Username must be at least 4 characters")
    .custom((value) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    }),
  body("password").notEmpty().withMessage("Password is required"),
  body("password-confirm")
    .exists()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Must enter a valid email"),
  (req, res) => {
    const { username, email, image, steamName } = req.body;
    let saltHash = genPassword(req.body.password);
    let salt = saltHash.salt;
    let hash = saltHash.hash;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("signup", {
        errors: errors.array(),
        email,
        username,
        steamName,
      });
    } else {
      let randomNum = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        image: `/../img/profile-${randomNum(1,3)}.png`,
        hash: hash,
        salt: salt,
        steamName: req.body.steamName || "",
        savedGames: [
          {
            title: "",
          },
        ],
      });
      newUser
        .save()
        .then(() => {
          steam
            .resolve(`https://steamcommunity.com/id/${steamName}`)
            .then((id) => {
              let steamInfo = steam.getUserRecentGames(id);
              return steamInfo;
            })
            .then((steamInfo) => {
              steamInfo.forEach((steamGame) => {
                // Convert game to IGDB
                igdb(CLIENT_ID, ACCESS_TOKEN)
                  .fields(["name, websites.*, cover.*,platforms.*,*"])
                  .search(steamGame.name)
                  .request("/games")
                  .then((response) => {
                    response.data.forEach((game, i) => {
                      if (
                        typeof game.websites != "undefined" &&
                        game.websites.some((obj) =>
                          obj.url.includes(steamGame.appID)
                        )
                      ) {
                        // Check if game already exists
                        User.findOne({ _id: req.session.passport.user })
                          .then((response) => {
                            if (
                              response.savedGames.find(
                                (obj) => obj.title === game.name
                              )
                            ) {
                              console.log(
                                `"${game.name}" is already added to account`
                              );
                            } else {
                              // Add games to User
                              User.findOneAndUpdate(
                                { _id: req.session.passport.user },
                                {
                                  $push: {
                                    savedGames: [
                                      {
                                        title: game.name,
                                        cover: `//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpeg`,
                                        category: game.genres[0].name,
                                        platforms: game.platforms,
                                        totalPlaytime: {
                                          lastUpdated:
                                            DateTime.now().toLocaleString(
                                              DateTime.newFormat
                                            ),
                                          time: Math.floor(
                                            steamGame.playTime / 60
                                          ),
                                        },
                                      },
                                    ],
                                  },
                                }
                              ).then((response) =>
                                console.log(response.savedGames)
                              );
                            }
                          })

                          .catch((err) => console.log(err));
                      }
                    });
                  });
              });
            })
            .then((response) => console.log(response))
            .then(() => {
              passport.authenticate("local")(req, res, () => {
                res.redirect("/Home");
              });
            })
            .catch((err) => console.log(err));
        })

        .catch((err) => console.log(err));
    }
  }
);

router.get("/login", (req, res) => {
  res.render("Login");
});

router.get("/account", isAuth, (req, res) => {
  let logout = () => {axios.get('/logout')}
  res.render("account", { user: req.user, click: logout });
});

router.post("/login",
  body('username')
    .notEmpty()
    .withMessage('Username cannot be empty')
    .custom(value=>{
      return User.findOne({ username: value }).then((user) => {
        if (!user) {
          return Promise.reject("Username does not exist");
        }
      });
    }),
   
  (req, res) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log(errors);
      res.render('login', {errors: errors.array()})
    }else{
      
      passport.authenticate("local",{successRedirect: '/home', failureRedirect:'/login', failureFlash:true})(req,res)
    }
  
});

router.post("/logout", (req, res) => {
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

router.post("/user-games", isAuth, (req, res, next) => {
  User.findOne({ _id: req.session.passport.user })
  .then((response) => {

    if(response.friends.length !== 0){
      
      let data = { friends:[]}
      data.savedGames = response.savedGames

      var findUsers = new Promise((resolve, reject) => {
        response.friends.forEach(id => {
            User.findById(id)
              .then(user=>{
                data.friends.push(user)
                if(data.friends.length === response.friends.length) resolve()
              })
              .catch(err=>console.log(err))
        })
      });
    
    findUsers.then(() => {
        res.send(data)
    });
      
    }else{
      let {username, savedGames} = response
      res.send({username,savedGames})
    }

    

    
  });
});

router.post("/update-status", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.session.passport.user, "savedGames._id": req.body.gameID },
    { $set: { "savedGames.$.isCompleted": true } }
  )
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
});

router.post(
  "/steam/connect",
  body("steamName")
    .notEmpty()
    .withMessage("Steam username cannot be empty")
    .custom((steamName) => {
      return User.findOne({ steamName }).then((user) => {
        if (user) {
          return Promise.reject("Steam Username already in use");
        }
      });
    }),
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("account", { errors: errors.array(), user: req.user });
    } else {
      const { steamName, _id } = req.body;
      steam
        .resolve(`https://steamcommunity.com/id/${steamName}`)
        .then(
          (id) => {
            console.log("Steam ID found");
            User.findOneAndUpdate(
              { _id: req.session.passport.user },
              { steamName: steamName },
              { useFindAndModify: false }
            ).then((user) => console.log(user));
            let steamInfo = steam.getUserRecentGames(id);
            return steamInfo;
          },
          (err) => {
            res.render("account", {
              errors: [
                { msg: "Could Not find Steam user", param: "steamName" },
              ],
              user: req.user,
            });
          }
        )
        .then((steamInfo) => {
          steamInfo.forEach((steamGame) => {
            // Convert game to IGDB
            igdb(CLIENT_ID, ACCESS_TOKEN)
              .fields(["name, websites.*, cover.*,platforms.*,*"])
              .search(steamGame.name)
              .request("/games")
              .then((response) => {
                response.data.forEach((game, i) => {
                  if (
                    typeof game.websites != "undefined" &&
                    game.websites.some((obj) =>
                      obj.url.includes(steamGame.appID)
                    )
                  ) {
                    // Check if game already exists
                    User.findOne({ _id: req.session.passport.user })
                      .then((response) => {
                        if (
                          response.savedGames.find(
                            (obj) => obj.title === game.name
                          )
                        ) {
                          console.log(
                            `"${game.name}" is already added to account`
                          );
                        } else {
                          // Add games to User
                          User.findOneAndUpdate(
                            { _id: req.session.passport.user },
                            {
                              $push: {
                                savedGames: [
                                  {
                                    title: game.name,
                                    cover: `//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpeg`,
                                    category: game.genres[0].name,
                                    platforms: game.platforms,
                                    totalPlaytime: {
                                      lastUpdated:
                                        DateTime.now().toLocaleString(
                                          DateTime.newFormat
                                        ),
                                      time: Math.floor(steamGame.playTime / 60),
                                    },
                                  },
                                ],
                              },
                            }
                          );
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                });
              });
          });
        })
        .then(() =>
          res.render("account", {
            user: { username: req.user.username, steamName },
          })
        )
        .catch((err) => console.log(err));
    }
  }
);

router.post("/steamID", (req, res) => {
  User.find({ _id: req.session.passport.user }).then((response) => {
    steam
      .resolve(`https://steamcommunity.com/id/${req.body.steamName}`)
      .then((id) => {
        let steamInfo = steam.getUserRecentGames(id);
        return steamInfo;
      })
      .then((steamInfo) => {
        steamInfo.forEach((steamGame) => {
          // Convert game to IGDB
          igdb(CLIENT_ID, ACCESS_TOKEN)
            .fields(["name, websites.*, cover.*,platforms.*,*"])
            .search(steamGame.name)
            .request("/games")
            .then((response) => {
              response.data.forEach((game, i) => {
                if (
                  typeof game.websites != "undefined" &&
                  game.websites.some((obj) => obj.url.includes(steamGame.appID))
                ) {
                  // Check if game already exists
                  User.findOne({ _id: req.session.passport.user })
                    .then((response) => {
                      if (
                        response.savedGames.find(
                          (obj) => obj.title === game.name
                        )
                      ) {
                        console.log(`"${game.name}" is already added to account`);
                      } else {
                        // Add games to User
                        User.findOneAndUpdate(
                          { _id: req.session.passport.user },
                          {
                            $push: {
                              savedGames: [
                                {
                                  title: game.name,
                                  cover: `//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpeg`,
                                  category: game.genres[0].name,
                                  platforms: game.platforms,
                                  totalPlaytime: {
                                    lastUpdated: DateTime.now().toLocaleString(
                                      DateTime.newFormat
                                    ),
                                    time: Math.floor(steamGame.playTime / 60),
                                  },
                                },
                              ],
                            },
                          }
                        ).then((response) => console.log(response.savedGames));
                      }
                    })

                    .catch((err) => console.log(err));
                }
              });
            });
        });
      })
      .then((response) => res.send(response))
      .catch((err) => console.log(err));
  });
});

router.post('/save',(req,res)=>{
  
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
    },
    {useFindAndModify:false})
  .then(response=>{res.send({response})})
})

router.post('/follow',(req,res)=>{
  let {title, cover, url, category, platforms, playTime} = req.body
  User.findOneAndUpdate({_id:req.session.passport.user},
    {$push: {
      anticipatedGames: [{
        title,
        cover,
        url,
        category,
        platforms,
        playTime
        }]
      }
    },
    {useFindAndModify:false})
  .then(response=>{res.send({response})})
})

router.post("/account/password",
body('password')
  .notEmpty()
  .withMessage('Password annot be left blank'),
body('password-confirm')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match!");
    }
    return true;
  }),
 (req, res) => {
  

  let errors = validationResult(req)

  if(!errors.isEmpty()){
    console.log(errors);
    User.findById(req.session.passport.user)
    .then(user=>{
      console.log(user);
      res.render('account', {
        user,
        errors: errors.array()
      });

    })
  }else{
    let { salt, hash } = genPassword(req.body.password);
    User.findOneAndUpdate(
      { _id: req.session.passport.user },
      { salt, hash },
      { useFindAndModify: false }
    ).then((response) => {
      res.render("account", {
        user: response,
        success: { msg: "Password succesfully updated!" },
        errors: errors.array()
      });
    });

  }
});
module.exports = router;
