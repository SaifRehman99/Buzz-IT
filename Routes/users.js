const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// router here
const router = express.Router();

const passport = require("passport");
const flash = require("connect-flash");

// for validating the user here
const { check, validationResult } = require("express-validator");

// importing the model here
const Users = require("../Models/users");

router.get("/register", checkState, (req, res) => {
    res.render("register");
});

// register the user here
router.post(
    "/register",
    checkState, [
        // username must be an 4 character long
        check("name").isLength({ min: 4 }),

        // password must be at least 4 chars long
        check("password").isLength({ min: 4 })
    ],
    (req, res) => {
        // / Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors.array());
        } else {
            let user = new Users({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            if (req.body.password !== req.body.password2) {
                res.send("<h1>Password not match!!!!</h1>");
            } else {
                // generating the hash here
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                        } else {
                            user.password = hash;
                            user
                                .save()
                                .then(result => {
                                    res.redirect("/user/login");
                                    req.flash("success", "User Registered");
                                })
                                .catch(error => {
                                    res.redirect("/user/register");
                                    req.flash("danger", "Cant Register");
                                });
                        }
                    });
                });
            }
        }
    }
);

// getting the login here
router.get("/login", checkState, (req, res) => {
    res.render("login", {
        user: req.user
    });
});

// login here
router.post("/login", checkState, (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next);
});

// logout here
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/user/login");
    req.flash("danger", "Logout Success");
});

// checking for the login user
function checkState(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

module.exports = router;