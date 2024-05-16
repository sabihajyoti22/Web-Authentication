require("dotenv").config()
const app = require("./7_CookieBasedAuth/app")
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is ruuning at location http://localhost:${PORT}`)
})