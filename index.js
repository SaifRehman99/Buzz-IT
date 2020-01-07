const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");

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

// getting the add article
app.get("/articles/add", (req, res) => {
    res.render("addArticle", {
        name: "Saif"
    });
});

// adding the article
app.post("/articles/add", (req, res) => {
    let article = new Artlices({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.author,
        body: req.body.body
    });

    article
        .save()
        .then(result => {
            res.redirect("/");
        })
        .catch(err => console.log(err));
});

// getting the single artilce
app.get("/articles/:id", (req, res) => {
    Artlices.findById(req.params.id)
        .then(data => {
            res.render("singleArticle", {
                data
            });
        })
        .catch(err => console.log(err));
});

// get edit artilce
app.get("/articles/edit/:id", (req, res) => {
    Artlices.findById(req.params.id)
        .then(data => {
            res.render("editArticle", {
                data
            });
        })
        .catch(err => console.log(err));
});

// POSt get articles
app.post("/articles/edit/:id", (req, res) => {
    let articles = {
        title: req.body.title,
        author: req.body.author,
        body: req.body.body
    };
    Artlices.updateOne({ _id: req.params.id }, articles)
        .then(data => {
            res.redirect("/");
        })
        .catch(err => console.log(err));
});

// deleting the article here
app.delete("/articles/:id", (req, res) => {
    Artlices.deleteOne({ _id: req.params.id })
        .then(data => {
            console.log("deleted!");
            res.redirect("/");
        })
        .catch(err => console.log(err));
});

// Setting the port here
const PORT = process.env.PORT || 1200;

// connecting the mongo to the application
mongoose
    .connect(
        "mongodb+srv://Saif:12345@cluster0-nwkpt.mongodb.net/test?retryWrites=true&w=majority", {
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