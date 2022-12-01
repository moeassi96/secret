//jshint esversion:6
////////////////////////////////////setup///////////////////////////////////////
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app =express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true})
/////////////////////////////////Schema & Model/////////////////////////////////
const userSchema =new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User", userSchema);

///////////////////////////////routing//////////////////////////////////////////
app.get("/",function(req,res){

  res.render("home");
});

app.get("/login",function(req,res){

  res.render("login");
});

app.get("/register",function(req,res){

  res.render("register");
});

app.get("/logout",function(req,res){

  res.render("home");
});

app.post("/register",function(req,res){

  const nUser= req.body.username;
  const nPass= req.body.password;

User.findOne({email:nUser},function(err,foundUser){
if(foundUser){
  res.redirect("/register")

}else{
  const newUser = new User({
    email:nUser,
    password:nPass
  })
    newUser.save();
     res.render("secrets");
}
})
});

app.post("/login",function(req,res){

  const attemptUser= req.body.username;
  const attemptPass= req.body.password;


User.findOne({email:attemptUser},function(err,foundUser){
  if(foundUser){
    if (foundUser.password === attemptPass){
     console.log("Successfully logged in");
       res.render("secrets");
    }else{
    console.log("Invalid password");
    res.redirect("/login");
    }

  }else{
    console.log("Invalid email");
    res.redirect("/login");
  }
})
});
///////////////////////////////server//////////////////////////////////////////
app.listen(3000,function(){
console.log("Server started on port 3000.")
});
