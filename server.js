var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var router = express.Router();
var RequestValidator = require('./RequestValidator');
var Accounts = require('./Accounts');
var Token = require('./Token');
var Records = require('./Records');
var PermissionValidator = require('./PermissionValidator');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'ptsk_user',
  password : 'secret',
  database : 'ptsk',
  multipleStatements: true
});

// Callback must release the connection after the query.
function getConnection(req, res, callback){
  pool.getConnection(function(err, connection) {
    if (err) {
      res.send('DB error. Please try again later.');
    } else {
      callback(connection, req, res);
    }
  });
}

router.post('/register', function(req, res) {
  if (RequestValidator.validateRequest(req, res, 'email', 'password')) {
    getConnection(req, res, Accounts.register);
  }
});

router.post('/login/:action', function(req, res) {
  if (RequestValidator.validateRequest(req, res, 'email', 'password')) {
    getConnection(req, res, Accounts.login);
  }
});

router.use(function (req, res, next) {
  if (RequestValidator.validateRequest(req, res, 'token') && Token.verify(req, res)) {
      next();
  }
});

router.post('/list/records', function(req, res) {
      getConnection(req, res, Records.listrecords);
});

router.post('/insert/record', function(req, res) {
  if (PermissionValidator.validatePermission(req, res, 'action', 'insert') && RequestValidator.validateRequest(req, res, 'data')) {
      getConnection(req, res, Records.insert);
  }
});

router.post('/delete/record/:id', function(req, res) {
  if (PermissionValidator.validatePermission(req, res, 'action', 'delete')) {
      getConnection(req, res, Records.delete);
  }
});

router.post('/update/record/:id', function(req, res) {
  if (PermissionValidator.validatePermission(req, res, 'action', 'update') && RequestValidator.validateRequest(req, res, 'data')) {
      getConnection(req, res, Records.update);
  }
});

router.post('/insert', function(req, res) {
    getConnection(req, res, Accounts.listUsers);
});

router.post('/delete', function(req, res) {
    getConnection(req, res, Accounts.listUsers);
});

app.use('/api', router);
app.listen(3001);
console.log('Server is running at: http://localhost: 3001');
