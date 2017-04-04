var randomstring = require('randomstring');
var hasher = require ('node-hasher');
var Token = require('./Token');

module.exports.register = function(connection, req, res){
var salt = hasher('sha256', (Date.now() + randomstring.generate(25)));
var password = hasher('sha256', (req.body.password + salt + req.body.email));
  connection.query('INSERT INTO `ptsk`.`users` (`email`, `password`, `salt`) VALUES (?, ?, ?)',
  [req.body.email, password, salt], function (err, results, fields) {
  connection.release();
  if (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.send('We already have a user with that email.');
    } else {
      res.send('DB error. Please try again later.');
    }
  } else {
    res.send('Plase enter with your email and password.');
  }
 });
}

module.exports.login = function(connection, req, res){
  connection.query('SELECT * FROM `ptsk`.`users` WHERE `email` = ?',
  [req.body.email], function (err, results, fields) {
  connection.release();
  if(!err && results[0]){
    if (validateCredentials(req, res, results[0])) {
      Token.signToken(res, {'id': results[0].id, 'email': results[0].email, 'action': req.params.action, 'expiresIn': '1h'})
    } else {
      res.send('Invalid password');
    }
  } else if (err) {
    console.log(err.code);
    res.send('DB error. Please try again later.');
  } else {
    res.send('Invalid username or password');
  }
 });
}

function validateCredentials(req, res, result){
  var hashedPassword = hasher('sha256', (req.body.password + result.salt + req.body.email));
  return hashedPassword === result.password;
}
