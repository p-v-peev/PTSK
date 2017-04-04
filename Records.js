module.exports.insert = function(connection, req, res) {
  connection.query('INSERT INTO `ptsk`.`records` (`data`, `user_id`) VALUES (?, ?)',
  [req.body.data, req.decoded.id], function (err, results, fields) {
  connection.release();
  if (err) {
    console.log(err.code);
    res.send('DB error. Please try again later.');
  } else {
    res.json('Done');
  }
 });
}

module.exports.delete = function(connection, req, res) {
  connection.query('DELETE FROM `ptsk`.`records` WHERE `id`= ? AND `user_id` = ?', [req.params.id, req.decoded.id], function (err, results, fields) {
  connection.release();
  if (err) {
    console.log(err.code);
    res.send('DB error. Please try again later.');
  } else {
    res.json('Done');
  }
});
}

module.exports.update = function(connection, req, res) {
  connection.query('UPDATE `ptsk`.`records` SET `data`= ? WHERE `id` = ? AND `user_id` = ?', [req.body.data, req.params.id, req.decoded.id], function (err, results, fields) {
  connection.release();
  if (err) {
    console.log(err.code);
    res.send('DB error. Please try again later.');
  } else {
    res.json('Done');
  }
});
}

module.exports.listrecords = function(connection, req, res) {
  connection.query('SELECT * FROM `ptsk`.`records` WHERE user_id = ?', [req.decoded.id], function (err, results, fields) {
  connection.release();
  if(!err && results){
    res.send(results);
  } else if (err) {
    console.log(err.code);
    res.send('DB error. Please try again later.');
  }
 });
}
