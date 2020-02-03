const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/usersDB',{ useUnifiedTopology: true , useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public/'));

app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
});
const User = mongoose.model('user',userSchema);

let defaultUser = new User({
    email:"abhinav.26aug@gmail.com",
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
app.post('/register',function(req,res){
   let newUser = new User({
       email: req.body.email,
       password : req.body.password
   }) ;
   newUser.save(function(err){
       if(!err){
           console.log('new user saved');
           res.redirect('/');
       }else{
           res.send(err);
       }
   })
});
app.post('/login',function(req,res){
    User.findOne({email:req.body.email , password:req.body.password} , function(err,foundUser){
        if(!err){
            if(foundUser){
                console.log('user match found! logging in....');
                res.render('secrets');
            }
            else{
                console.log('user match not found!');
                res.redirect('/login');
            }
        }else{
            res.send(err);
        }
    })
});

port = 3000;
app.listen(port,function(){
  console.log("server started at port "+port);
});