require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public/'));

app.set('view engine', 'ejs');

// app.use(session({
//   secret: 'Our little Secert.',
//   resave : false,
//   saveUninitialized : false,
// }));


app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect('mongodb://localhost/usersDB',{ useUnifiedTopology: true , useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

// userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('user',userSchema);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
// passport.use(new LocalStrategy({
//   usernameField : 'email',
//   passwordField : 'password'
// } , function(username,password,done){
//   User.findOne({username:username} , function(err,user){
//     if(err){
//       return done(err);
//     }else{
//       if(!user){
//         return done(null,false,{message:'user not found'});
//       }
//       if(!user.validPassword(password)){
//         return done(null,false,{message:"incorrect password"});
//       }
//       return done(null,user);
//     }
//   });
// }));
//
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

let defaultUser = new User({
    username:"abhinav.26aug@gmail.com",
    password:"gmail@com"
});

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
  // if(req.isAuthenticated()){
  //   console.log("secrets page : authenticated");
  //   res.render('secrets');
  // }else{
  //   console.log("secrets page : error in authentication");
  //   res.redirect('/login');
  // }
});

app.post('/register',function(req,res){

  let newUser = new User({
      username: req.body.email,
  }) ;

  User.register(newUser,req.body.password, function(err, user){
    if(err){
      console.log(err);
      console.log("register page : error in registration");
      res.send(err);
    }else{
      console.log("register page: no error in registration");
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.post('/login',passport.authenticate('local'),function(req,res){
    res.redirect('/secrets');

    // User.findOne({email:req.body.email} , function(err,foundUser){
    //     if(!err){
    //         if(foundUser){
    //             if(bcrypt.compareSync(req.body.password, foundUser.password)){
    //                 console.log('user match found! logging in....'+foundUser);
    //                 res.render('secrets');
    //             }
    //             else{
    //                 console.log('incorrect password entered');
    //                 res.redirect('/login');
    //             }
    //         }
    //         else{
    //             console.log('user match not found!');
    //             res.redirect('/login');
    //         }
    //     }else{
    //       console.log(err);
    //       res.redirect('/login');
    //     }
    // })
});

port = 3000;
app.listen(port,function(){
  console.log("server started at port "+port);
});
