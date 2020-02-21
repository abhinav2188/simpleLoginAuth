require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passport = require('passport')
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

const userSchema = new mongoose.Schema({});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user',userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.get('/success',function(req,res){
  if(req.isAuthenticated()){
    res.render('success');
  }
  else{
    res.redirect('/login');
  }
});

app.post('/register',function(req,res){
  User.register({username:req.body.email}, req.body.password, function(err, user) {
    if (err) {
      res.render('failure',{msg:err});
    }
    res.redirect('/login');
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
        res.redirect('/success');
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
