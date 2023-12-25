require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const ejs = require("ejs")
const cors = require("cors")
const passport = require("passport")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const User = require("./Model/user.model")
require("./Config/passport")

// For CORS
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// For ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,"./View"));

// For bcrypt
const bcrypt = require('bcrypt');
const { config } = require("process")
const { read } = require("fs")
const saltRounds = 10;

// Database Connection
mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Database is connected")
})
.catch((error)=>{
    console.log(error.messege)
})

// Creating Session 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: "passportSession"
  })
}))

app.use(passport.initialize());
app.use(passport.session());

// Home Route
app.get("/",(req,res)=>{
    res.render("home")
})
// Register : get
app.get("/Register",(req,res)=>{
    res.render("register")
})
// Register : post
app.post("/Register",async (req,res)=>{
   try {
        const user = await User.findOne({ username: req.body.username})
        if(user)
            return res.status(201).json("User Already Exsist")
        bcrypt.hash(req.body.password, saltRounds,async (err, hash) =>{
            const newUser = new User({
                username: req.body.username,
                password: hash
            })
            await newUser.save()
            res.redirect("/Login")
        });
        
   } catch (error) {
        res.status(500).send(error.message);
   }
})
// Login : get
const checkLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect("/Profile")
    }
    next()
}

app.get("/Login",checkLoggedIn,(req,res)=>{
    res.render("login")
})

// Login : Post
app.post('/Login', 
  passport.authenticate('local', { failureRedirect: '/login', successRedirect: "/Profile" }),
);

// Profile : get
const checkAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/Login")
}
app.get("/Profile",checkAuthenticated,(req,res)=>{
    res.render("profile")
})
// Logout : get
app.get("/Logout",(req,res)=>{
    try {
        req.logout((err)=>{
            if(err){
                return next(err)
            }
        })
        res.redirect("/")
    } catch (error) {
        res.status(500).send(error.message);
    }
})
module.exports = app