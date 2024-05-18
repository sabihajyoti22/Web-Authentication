const express = require("express")
const router = express.Router()
const { getUser, register, login, updateUser, deleteUser } = require("../Controller/user.controller")

router.get("/",getUser)
router.post("/register", register)
router.post("/login", login)
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" })
})
router.patch("/:id",updateUser)
router.delete("/:id",deleteUser)

module.exports = router