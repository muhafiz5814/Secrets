import "dotenv/config"
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import passport from "passport"
import session from "express-session"
import passportLocalMongoose from "passport-local-mongoose"

const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

await mongoose.connect(process.env.CONNECTING_STRING_USERDB)

const schema = mongoose.Schema

const userSchema = new schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

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

app.get("/secrets", (req, res) => {
    // Below isAuthenticated() method is from passport
    if(req.isAuthenticated()) {
        res.render("secrets")
    } else {
        res.redirect("/login")
    }
})

app.post("/register", (req, res) => {

    // Below register() method is from passport-locao-mongoose module
    User.register({username: req.body.username}, req.body.password, (err, user) => {
        if(err) {
            console.log(err)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets")
            })
        }
    })

})

app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    // Below login() method is from passport
    req.login(user, (err) => {
        if(err) {
            console.log(err)
            res.redirect("/login")
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets")
            })
        }
    })

})

app.get('/logout', (req, res, next) => {
    // Below logout() method is from passport
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/')
    })
})

app.listen(port, (req, res) => {
    console.log("Server is running on port " + port)
})
