let passwordValidator = require('password-validator'); 

let schema = new passwordValidator();

/*  Shema for the Password validation, for more security   ** 
**  First, the password have 6 minimal caracters           **
**  Then a maximal size fo 100 caracters                   **
**  Must have minimum of one uppercase                     **
**  Then have a minimum of one lowercase                   **
**  Must have a minimum of one number                      **
**  No spaces are admited in the password settings         */


schema
.is().min(6)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()                         

//Module export

module.exports = schema; 