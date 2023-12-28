import "dotenv/config"
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption"

const app = express()
const port = process.env.PORT || 3000
const secretKey = process.env.ENCRYPTION_KEY || "TeriTo...Ruk"
console.log(process.env.ENCRYPTION_KEY)

console.log(process.env)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

await mongoose.connect("mongodb+srv://muhafiz-admin:lPt9H23OyTJERuIz@secrets-cluster.l8cp30t.mongodb.net/userDB")

const schema = mongoose.Schema

const userSchema = new schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: secretKey, encryptedFields: ['password'] })

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    try {
        newUser.save()
        res.render("secrets")
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const user = await User.findOne({email: username})
        if (user.password === password) {
            res.render("secrets")
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(404)
    }
})

app.get("/submit", (req, res) => {
    res.render("submit")
})

app.listen(port, (req, res) => {
    console.log("Server is running on port " + port)
})
