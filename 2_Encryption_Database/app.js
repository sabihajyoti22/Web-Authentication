require("dotenv").config()
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()

const DB_URL = process.env.DB_URL
const clientSchema = require("./clients.encryption")

mongoose.connect(DB_URL)
.then(()=>{
    console.log("Database is connected")
})
.catch((err)=>{
    console.log(err)
})

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post("/register",async (req,res)=>{
    try {
        const client = clientSchema(req.body)
        await client.save()
        res.status(201).json({status: "New client has created"})
    } catch (error) {
        res.status(500).json({status: "Something is broke"})
    }
})

app.post("/login",async (req,res)=>{
    try {
        const {email,password} = req.body
        const client = await clientSchema.findOne({email: email})
        if (client && password === client.password) {
            res.status(201).json({status: "Login Successfull"})
        } else {
            res.status(400).json({status: "Client not found"})
        }
    } catch (error) {
        rmSync.status(500).json({status: error})
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