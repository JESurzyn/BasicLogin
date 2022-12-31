const Joi = require('joi');

module.exports.userSchema = Joi.object({
    user:Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required()
    }).required()    
});