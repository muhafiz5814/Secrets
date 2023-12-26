import express from "express"
import bodyParser from "body-parser"


const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
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
