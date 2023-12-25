require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const md5 = require("md5")
const cors = require("cors")
const path = require("path")
const app = express()

const DB_URL = process.env.DB_URL
const clientSchema = require("./clients.hashing")

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
        const client = new clientSchema({
            email: req.body.email,
            password: md5(req.body.password)
        })
        await client.save()
        res.status(201).json(client)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post("/login",async (req,res)=>{
    try {
        const {email, password} = req.body
        const loginData = await clientSchema.findOne({email: email})
        if (loginData && md5(password) === loginData.password) {
            res.status(202).json("Login successfull")
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