import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"

const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

await mongoose.connect("mongodb+srv://muhafiz-admin:lPt9H23OyTJERuIz@secrets-cluster.l8cp30t.mongodb.net/userDB")

const schema = mongoose.Schema

const userSchema = new schema({
    email: String,
    password: String
})

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

app.get("/submit", (req, res) => {
    res.render("submit")
})

app.listen(port, (req, res) => {
    console.log("Server is running on port " + port)
})
