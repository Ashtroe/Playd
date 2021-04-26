const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let gameSchema =
  new Schema({
    title: { type: 'String', required: true },
    cover: { type: 'String', required: true },
    url: { type: 'String'},
    platforms: { type: 'Array', required: false },
    isCompleted: {type: 'Boolean', default: false}
  })

let userSchema =
  new Schema({
    email: { type: 'String', required: true },
    username: { type: 'String', required: true },
    hash: { type: 'String', required: true },
    salt: { type: 'String', required: true },
    savedGames:[gameSchema]
  })


module.exports = mongoose.model('User', userSchema)
