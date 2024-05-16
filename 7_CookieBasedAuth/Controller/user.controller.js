require("dotenv").config()
const { v4: uuid } = require("uuid")
const userSchema = require("../Model/user.model")
const { createSecretToken } = require("../TokenGeneration/generateToken")
const bcrypt = require("bcrypt")

const getUser = async (req, res) => {
    try {
        const users = await userSchema.find()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const register = async (req, res) => {
    try {
    if (!(req.body.email && req.body.password)) {
        res.status(400).send("All input is required");
    }

    const oldUser = await userSchema.findOne({ email: req.body.email });

    if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new userSchema({
        id: uuid(),
        email: req.body.email,
        password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
        path: "/", // Cookie is accessible from all paths
        expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
        secure: true, // Cookie will only be sent over HTTPS
        httpOnly: true, // Cookie cannot be accessed via client-side scripts
        sameSite: "None",
    });

    console.log("cookie set succesfully")

    res.json(user)
    } catch (error) {
    console.log("Gott an error", error);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(400).json({ message: "All input is required" });
    }
    const user = await userSchema.findOne({ email });
    if (!(user && (await bcrypt.compare(password, user.password)))) {
        return res.status(404).json({ message: "Invalid credentials" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
        domain: process.env.frontend_url, // Set your domain here
        path: "/", // Cookie is accessible from all paths
        expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
        secure: true, // Cookie will only be sent over HTTPS
        httpOnly: true, // Cookie cannot be accessed via client-side scripts
        sameSite: "None",
    });

    res.json({ token });
}

const updateUser = async (req, res) => {
    try {
        const selectedUser = await userSchema.findOne({ id: req.params.id })
        selectedUser.name = req.body.name
        selectedUser.password = req.body.password
        await selectedUser.save()
        res.status(202).send("<h1>Updated one user</h1>")
    } catch (error) {
        res.send(error.message)
    }
}

const deleteUser = async(req, res) => {
    try {
        await userSchema.deleteOne({ id: req.params.id })
        res.status(203).send("<h1>Deleted one user</h1>")
    } catch (error) {
        res.send(error.message)
    }
}


module.exports = { getUser, register, login, updateUser, deleteUser }