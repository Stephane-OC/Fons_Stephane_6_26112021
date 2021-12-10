//Intall express
const express = require('express');
//Moogose is the module to use MongoDB
const mongoose = require('mongoose');
//Security module for headers protections
const helmet = require("helmet");
//Security module against XSS attack
const xss = require("xss-clean");
//Express module to make time out scessions
const rateLimit = require("express-rate-limit");
//Module to make my variable charged
const dotenv = require('dotenv');
//Make the use of Cors easier
const cors = require('cors');
//Protection module againts noSql injections attack
const mongoSanitize = require('express-mongo-sanitize');
//Module who help to hide our mango db adress
const path = require("path");
dotenv.config();

const { HIDDEN_TOKEN } = require('./config.json');
//Logger, to get back informations in our terminal
const morgan = require("morgan");




const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const app = express();



mongoose.connect(HIDDEN_TOKEN,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});


//Instead of bodyparser, we use the Express body parser module
app.use(express.json());

app.use(helmet());

app.use(xss());

app.use(mongoSanitize());

app.use(cors());

app.use(morgan("dev"));

const limiter = rateLimit({
  //One session can only be valid 15 minutes
  windowMs: 15 * 60 * 1000, 
  //limitation to 100 request / IP
  max: 100
})

app.use(limiter);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;