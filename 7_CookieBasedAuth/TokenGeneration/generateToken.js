require("dotenv").config()
const jwt = require("jsonwebtoken")

createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  })
}

createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  })
}


module.exports = { createAccessToken, createRefreshToken }