const passwordValid = require('../models/passValid') 

//Creation and exported our module

module.exports = (req, res, next) => { 
    //If Password isn't match to our model 
    if (!passwordValid.validate(req.body.password)) { 
        //Message sended to the user
        res.status(400).json({message : 'Votre mot de passe doit comporter au minimum un chiffre, une majuscule et aucun espace!'}) 
    } else {
        next();
    } 
} 