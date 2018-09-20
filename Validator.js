var validator = require('validator');


module.exports = function(value, req){
    let reasons = [];
    if(req.req && validator.isEmpty(value)) reasons.push('Field is Required');
    if(req.email && !validator.isEmail(value)) reasons.push('Needs To Be An Email');
    if(req.numeric && !validator.isNumeric(value)) reasons.push('Only Numbers Are Allowed');
    if(req.minLength && !validator.isLength(value, {min: req.minLength, max: undefined})) reasons.push('Too Short');
    if(req.maxLength && !validator.isLength(value, {min: undefined, max: req.maxLength})) reasons.push('Too Long');
    if(req.minValue && !validator.isInt(value, {min: req.minValue, max: undefined})) reasons.push('Too Small');
    if(req.maxValue && !validator.isInt(value, {min: undefined, max: req.maxValue})) reasons.push('Too Big');

    return reasons
};