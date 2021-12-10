const Sauce = require("../models/sauce");
const fs = require("fs");


//Function to display all sauces
module.exports.getAllSauce = (req, res, next) => {
  //we use "find" method from mongoose to find sauces in our DB
  Sauce.find()
    //Response is sended
    .then((sauces) => res.status(200).json(sauces))
    //if don't we sended back an error 400
    .catch((error) => res.status(400).json({ error }));
};

//Function do display one sauce
module.exports.getOneSauce = (req, res, next) => {
  //we use findOne method from mongoose to find only ONE sauce in our DB
  Sauce.findOne({ _id: req.params.id })
    //Response is sended
    .then((sauce) => res.status(200).json(sauce))
    //if don't we sended back an error 400
    .catch((error) => res.status(404).json({ error }));
};

//Function to create a sauce
module.exports.createSauce = (req, res, next) => {
  //We get back on JSON format
  const sauceObject = JSON.parse(req.body.sauce);
  //Here we deleted the ID
  delete sauceObject._id;
  //A new objet sauce is created
  const sauce = new Sauce({
    ...sauceObject,
 
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,

    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersdisLiked: []
  });
  sauce
    //sauce is saved in the database
    .save()
    //200 response is sended back
    .then(() => res.status(201).json({ message: "Holé Sauce enregistrée !" }))
    //if don't an 400 error is sended back to the user
    .catch((error) => res.status(400).json({ error }));
  
};



//Function to modify a sauce
module.exports.modifySauce = (req, res, next) => {
  //We check if there is a new picture or not and if there is a picture
  const sauceObject = req.file ? 
  //We get back the data's to JSON format
  { ...JSON.parse(req.body.sauce), 
    //here we handle our picture format ==> if don't, we just get back the datas
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` } : { ...req.body };
  //We update the sauce in our database with ID check  
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    //Positive response ==> code 200
    .then(() => res.status(200).json({ message: "Holé la sauce a été modifiée" }))
    //Negative response ==> code 400
    .catch((error) => res.status(400).json({ error }));
};


//Function to delete a sauce
module.exports.deleteSauce = (req, res, next) => {
  console.log(req.params);
  //We find our sauce with her "ID" in the request
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Our image's URL is split to only have the file name
      //vérification du bon utilisateur sinon renvoyer une erreur
      const filename = sauce.imageUrl.split("/images/")[1];
      
      //With her name, we can now remove the sauce
      fs.unlink(`images/${filename}`, () => {
        //Then we delete the sauce with "deleteOne" property in MongoDB
        //double check, sauce Id & User Id
        Sauce.deleteOne({ _id: req.params.id }, { deleteSauce: req.body.userId})
          //Positive response ==> code 200
          .then(() => res.status(200).json({ message: "Holé la sauce a été supprimée !" }))
          //Negative response ==> code 400
          .catch((error) => res.status(400).json({ error }));
      });
    })
    //If don't, we catch an error message
    .catch((error) => res.status(500).json({ error }));
};

//Here we handle the like / dislike
module.exports.likesDislikes = (req, res, next) => {
  //In here, valor of "1" is he to indicated a "like"
  if(req.body.like === 1) {
      //Here we use "updateOne" to make our sauces updated
      Sauce.updateOne(
          //Update sauce is defined by her ID
          {_id: req.params.id},
          //"$ink" parameter of MongoDB to make 1 more like
          //"$push" parameter of MongoDB to append our value in the array
          {$inc: {likes: +1}, $push: { usersLiked: req.body.userId}})
          //Positive response ==> Code 200
          .then(() => res.status(200).json({message : "Holé j'aime cette sauce !"}))
          //Negative response ==> Code 400 error message
          .catch(error => res.status(400).json({ error }))
  }
  //Here, the negative value "-1" has the signification of one dislike
  else if(req.body.like === -1) {
      //"updateOne" is here to update our sauce's likes
      Sauce.updateOne(
          //the sauce is define by her "ID"
          {_id: req.params.id},
          //Here we use  $inc of MongoDB to increment our dislikes by 1
          {$inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId}})
          //Then we send back positive response ==> code 200
          .then((sauce) => res.status(200).json({message : "Holé Je n'aime plus cette sauce !"}))
          //If don't we throw a negative response ==> code 400
          .catch(error => res.status(400).json({ error }))

  }
  //If the value is equal to 0, this is the signification of cancelation of one like or dislike
  else {
      //So we find our sauce by her "ID"
      Sauce.findOne({_id: req.params.id})
      .then(sauce => {
          //In the case user is in the array of values
          if(sauce.usersLiked.includes(req.body.userId)) {
              //Sauce update "updateOne"
              Sauce.updateOne(
                  //We first remove the user from the array of likes by using "$pull" of MongoDB
                  {$pull: {usersLiked: req.body.userId,
                  //Then we remothe the like
                  $inc: {likes: -1}}})
                  //Positive response ==> code 200
                  .then(() => res.status(200).json({message: "Holé J'aime enlevé"}))
                  //Negative response ==> code 400
                  .catch(error => res.status(400).json({error})
              )
          }
          //Else, if the user is the arry of dislikes
          else if(sauce.usersDisliked.includes(req.body.userId)) {
              //Sauce update "updateOne"
              Sauce.updateOne(
                  //We first remove the user from the array of dislikes
                  {$pull: {usersDisliked: req.body.userId, 
                  //then we remove the dislike
                  $inc: {Dislikes: -1}}})
                  //Positive reponse ==> code 200
                  .then(() => res.status(200).json({message: "Holé Dislike enlevé !"}))
                  //Negative resonse ==> code 400
                  .catch(error => res.status(400).json({error})
              )
          }
      })
  }
};