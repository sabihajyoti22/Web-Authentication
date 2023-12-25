require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const app = express()

const DB_URL = process.env.DB_URL
const clientSchema = require("./clients.salting")

const bcrypt = require('bcrypt');
const saltRounds = 10;

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

app.post("/register", async(req,res)=>{
    try {
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            const client = new clientSchema({
                email: req.body.email,
                password: hash
            })
            await client.save()
            res.status(201).json(client)
        });
        
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post("/login",async (req,res)=>{
    try {
        const {email, password} = req.body
        const loginData = await clientSchema.findOne({email: email})
        if (loginData) {
            bcrypt.compare(password, loginData.password, function(err, result) {
                if(result === true)
                    res.status(202).json("Login successfull")
            });
        } else {
            res.status(400).json("Client not found")
        }  
    } catch (error) {
        res.status(500).json(error)
    }
})

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../View/index.html"))
})

app.use((req,res,next)=>{
    res.send("<h1>Route not found</h1>")
})

app.use((error,req,res,next)=>{
    res.send("<h1>Server not found</h1>")
})

module.exports = app