var jwt = require('jsonwebtoken');
var Config = require('./Config');
var crypto = require('crypto');

module.exports.signToken = function(res, tokenData) {
  var token = (jwt.sign(tokenData, Config.tokenSecret, { algorithm: 'HS512' }));
  res.send(encryptToken(token));
}

module.exports.verify = function(req, res) {
  try {
    req.decoded = jwt.verify(decryptToken(req.body.token || req.heades.token), Config.tokenSecret, { algorithm: 'HS512' });
    return true;
  } catch (err) {
    res.send('Invalid token.');
    return false;
  }
}

function encryptToken(token) {
  var cipher = crypto.createCipher(Config.algorithm, Config.key, Config.iv);
  var crypted = cipher.update(token,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decryptToken(token) {
  var decipher = crypto.createDecipher(Config.algorithm, Config.key, Config.iv);
  var dec = decipher.update(token,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
