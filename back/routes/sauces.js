const express = require("express");
const router = express.Router();

//There are all the middleware who are required
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//Here are the sauces controller's
const saucesCtrl = require("../controllers/sauces");

/*  Every single route will require authentification so you need to be      **    
**  authentificate to have accès to some options, so only the               **
**  authentificate user can be allowed to do for exemple "delete" action    */

//Here we add "multer" for pictures management
router.post("/",  auth, multer,saucesCtrl.createSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.get("/", auth, saucesCtrl.getAllSauce);
//Here we add "multer" to to manage pictures modifications
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", saucesCtrl.deleteSauce);


module.exports = router;