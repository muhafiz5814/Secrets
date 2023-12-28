import "dotenv/config"
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import bcrypt from "bcrypt"

const app = express()
const port = process.env.PORT || 3000
const saltRounds = 10

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

await mongoose.connect(process.env.CONNECTING_STRING_USERDB)

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

app.post("/register", async (req, res) => {

    const hash = await bcrypt.hash(req.body.password, saltRounds)

    const newUser = new User({
        email: req.body.username,
        password: hash
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
        const matched = await bcrypt.compare(password, user.password)
        
        if (matched) {
            res.render("secrets")
        } else {
            res.render("login")
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
