require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require("./Routes/user.route")

const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL)
.then(()=>{
    console.log("MongoDB Atlas is connected")
})
.catch((err)=>{
    console.log(err)
})

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // Replace with your frontend domain
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies, etc.)

    // Pass to next layer of middleware
    next();
});

app.use("/api/users", userRouter)

app.use("/",(req,res)=>{
    res.statusCode = 200;
    res.send("<h1>Welcome to Cookie Based Authentication</h1>")
})

// Route not found error
app.use((req,res,next)=>{
    res.statusCode = 404;
      res.send("<h1>404 Page not found!!!</h1>")
  })
// Server error
app.use((error,req,res,next)=>{
  res.statusCode = 500;
    res.send("<h1>Server Error</h1>")
})

module.exports = app