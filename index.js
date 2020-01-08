const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");

// for saving the state of login logout user
const session = require("express-session");

// for saving the global varible data
const flash = require("connect-flash");

// importing the model here
const Artlices = require("./Models/article");

// initialize here
const app = express();

// setting up the engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// middleware for parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// making the static folder here
app.use(express.static(path.join(__dirname, "static")));

// using the session middleware here for saving the state of login user :)
app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true
    })
);

// setting the flash messages here to notify the messages
app.use(flash());
app.use(function(req, res, next) {
    res.locals.messages = require("express-messages")(req, res);
    next();
});

// passport here
require("./config/passport")(passport);

// initialize middleware
app.use(passport.initialize());
app.use(passport.session());

// setting the login user global user here
app.get("*", (req, res, next) => {
    res.locals.USER = req.user;
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("danger");

    next();
});

// creating the routes here
app.get("/", (req, res) => {
    Artlices.find()
        .select("_id author title body")
        .exec()
        .then(data => {
            res.render("index", {
                data
            });
        });
});

// importing the article route here
app.use("/articles", require("./Routes/article"));

// importing the users route here
app.use("/user", require("./Routes/users"));

// Setting the port here
const PORT = process.env.PORT || 1200;

// connecting the mongo to the application
mongoose
    .connect(
        "mongodb+srv://SaifRehman:12345s@cluster0-dsdv1.mongodb.net/test?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(result => {
        console.log(`Connected Successfully to MongoDB!`);
        app.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`);
        });
    })
    .catch(err => console.log(`Connection Failed to MongoDB : ${err}`));