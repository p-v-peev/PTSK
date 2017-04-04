module.exports.validatePermission = function(req, res, permission, value){
  if (req.decoded[permission] === value) {
    return true;
  } else {
    res.send("Access denied");
    return false;
  }
}
