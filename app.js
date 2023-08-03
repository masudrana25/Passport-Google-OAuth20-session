const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const app = express();
require('./config/database');
const User = require('./models/user.schema.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./config/passport');

app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/passport_google_auth20',
    collectionName: "sessions",
  })
  // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

//home url
app.get('/', (req, res) => {
  res.render('index');
});


// login get
const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/profile');
  };
  next();
}

app.get('/login',checkLoggedIn, (req, res) => {
  res.render('login');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', successRedirect : '/profile' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


//profile protected route
const checkAuthenticated = (req, res, next) =>{
  if (req.isAuthenticated()) {
    return next();
  };
  res.redirect('/login')
};

// app.get('/profile', checkAuthenticated, (req, res) => {
//   res.render("profile",{username : req.user.username, email : req.user.email});
// });

app.get('/profile', checkAuthenticated, (req, res) => {
  if (req.user) {
    res.render("profile", { username: req.user.username});
  } else {
    // Handle the case where req.user is undefined (user not authenticated)
    res.redirect('/login');
  }
});

//logout route
app.get('/logout', (req, res) => {
  try {
    req.logout((err)=>{
      if (err) {
      return next(err);
      };
      res.redirect('/');
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
});






module.exports = app;
