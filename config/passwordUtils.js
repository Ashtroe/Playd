const crypto = require("crypto");

let genPassword = (password) =>{
    let salt = crypto.randomBytes(32).toString('hex')
    let genHash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex')
  
    return {
      salt:salt,
      hash:genHash
    }
  }
  
  let validatePass = (password,hash,salt) =>{
    let hashVerify = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex')
  
    return hash === hashVerify
  }

  module.exports.genPassword = genPassword
  module.exports.validatePass = validatePass