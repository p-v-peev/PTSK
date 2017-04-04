module.exports.validateRequest = function(req, res, ...reqiredParams) {
  var validationResult = validateRequiredParams(req, reqiredParams);
    if (validationResult === undefined) {
      return true;
    } else {
      res.send(validationResult);
      return false;
    }
}

function validateRequiredParams(req, params){
  var errorMessage = undefined;
  var length = params.length;
  for (var i = 0; i < length; i++) {
    if (req.body[params[i]] === undefined && req.headers[params[i]] === undefined) {
      errorMessage = `Missing required parameter ${params[i]}`;
      break;
    }
  }
  return errorMessage;
}
