
const jwt = require('jsonwebtoken'); //Jsonwebtoken is use to crypt and ancrypt tokens

/*********************************************************************************/
//Authentification module
//This Function, is make sauce changes imposible
module.exports = ( req, res, next ) => { 
    try {
        //Spliting header request to only have the Token
        const token = req.headers.authorization.split(' ')[1]; 
        //Token decode with secret key
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
        //Token Verification in a "const"
        const userId = decodedToken.userId; 

        /** If User ID doesn't match to the token        ** 
        **  message sended to indicate "Invalid user ID" */
        if (req.body.userId && req.body.userId !== userId) { 
            throw 'Invalid user Id'; 
        } else {
            //else the next Middleware will be called
            next(); 
        }
    }
    catch {
        res.status(401).json({error: new Error('Invalid Request!')})

    }
}