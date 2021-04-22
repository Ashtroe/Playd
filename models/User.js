const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema =
  new Schema({
    username: { type: 'String', required: true },
    password: { type: 'String', required: true },
    savedGames:[]
  })


module.exports = mongoose.model('User', userSchema)
