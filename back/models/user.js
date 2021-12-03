//Packages Imports

const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");


//Shema defined
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Modules Export
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);