require("dotenv").config()
const app = require("./6_Passport_GoogleAuth20/app")
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is ruuning at location http://localhost:${PORT}`)
})