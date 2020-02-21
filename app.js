require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const session = require("express-session");

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

mongoose.connect('mongodb://localhost/usersDB',{ useUnifiedTopology: true , useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public/'));
app.set('view engine', 'ejs');


app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy({username:'email'},
//   function(username, password, done) {
//     console.log("in loacl strategy");
//     User.findOne({ email: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

const userSchema = new mongoose.Schema({});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user',userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// let defaultUser = new User({
//     email:"abhinav.26aug@gmail.com",
//     password:"gmail@com"
// });

// defaultUser.save();

// default route - get
app.get('/',function(req,res){
    res.render('home');
});
app.get('/register',function(req,res){
    res.render('register');
});
app.get('/login',function(req,res){
    res.render('login');
});
app.get('/secrets',function(req,res){
  console.log(req);
  if(req.isAuthenticated()){
    res.render('secrets');
  }
  else{
    res.render('failure',{msg:'Error in redirecting secrets / authentication'})
  }
});

app.post('/register',function(req,res){
  User.register({username:req.body.email}, req.body.password, function(err, user) {
    if (err) {
      res.render('failure',{msg:err});
    }
    res.redirect('/login');
    // var authenticate = passport.authenticate('local');
    // authenticate(req,res,function(){
    //   res.redirect('/secrets');
    // });
    // var authenticate = User.authenticate();
    // authenticate(req.body.email, req.body.password, function(err, result) {
    //   if (err) {
    //   res.render('failure',{err:'error in authentication'}) }
    //   else{
    //     res.redirect('/secrets');
    //   }
    // });
  });
});

app.post('/login',function(req,res){
  let user = new User({
    username:req.body.email,
    password:req.body.password
  });
    req.login(user,function(err){
      if(err){
        res.render('/failure',{msg:err});
      }else{
        res.redirect('/secrets');
      }
    })
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

port = 3000;
app.listen(port,function(){
  console.log("server started at port "+port);
});
