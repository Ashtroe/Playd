const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");


const randomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let now = DateTime.local()
var newFormat = delete DateTime.DATETIME_MED.time

let yesterday = now.minus({days:1}).toLocaleString(DateTime.newFormat)
let twoDaysAgo = now.minus({days:2}).toLocaleString(DateTime.newFormat)
let threeDaysAgo = now.minus({days:3}).toLocaleString(DateTime.newFormat)
let fourDaysAgo = now.minus({days:4}).toLocaleString(DateTime.newFormat)
let fiveDaysAgo = now.minus({days:5}).toLocaleString(DateTime.newFormat)
let sixDaysAgo = now.minus({days:6}).toLocaleString(DateTime.newFormat)
let sevenDaysAgo = now.minus({days:7}).toLocaleString(DateTime.newFormat)

let pastWeek = 
  [
  yesterday,
  twoDaysAgo,
  threeDaysAgo,
  fourDaysAgo,
  fiveDaysAgo,
  sixDaysAgo,
  sevenDaysAgo
]

let gameSchema =
  new Schema({
    title: { type: 'String', required: true},
    cover: { type: 'String', required: true },
    url: { type: 'String'},
    category: { type: 'String', },
    platforms: { type: 'Array', },
    isCompleted: {type: 'Boolean', default: false},
    playTime: {type:'Mixed', default:[
                                      { date:yesterday,
                                        time:0},
                                      { date:twoDaysAgo,
                                        time:0},
                                      { date:threeDaysAgo,
                                        time:0},
                                      { date:fourDaysAgo,
                                        time:0},
                                      { date:fiveDaysAgo,
                                        time:0},
                                      { date:sixDaysAgo,
                                        time:0},
                                      { date:sevenDaysAgo,
                                        time:0},
                                      {total: 0}
                                      ]},
    totalPlaytime: {type: 'Mixed', default: {
                                              lastUpdated:now,
                                              time:0
                                            }}
                           
  })


let userSchema =
  new Schema({
    email: { type: 'String', required: true },
    username: { type: 'String', required: true },
    image: { type: 'String', required: true, default: '/img/profile1' },
    hash: { type: 'String', required: true },
    salt: { type: 'String', required: true },
    savedGames:[gameSchema],
    friends:{type: 'Array' },
    anticipatedGames:{type:'Array'},
    steamName: {type: 'String'}
  })


module.exports = mongoose.model('User', userSchema)
