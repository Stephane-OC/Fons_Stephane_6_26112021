/*  Here are defined all the Regex rules, for more sécurity    **
**  so user have to write true email adress rules to be able   ** 
**  to create an acount                                        */
module.exports = ( req, res, next) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
       next()
     } else {
       /*   If Email rules are false, or if user make a mistakes,           **
       **   he can't create an acount and a error message is sended back    **
       **   to the user so the user his notice to change informations       */
     res.status(400).json({message : "L'Email renseigné est incorrect !"}) 
       }
   }