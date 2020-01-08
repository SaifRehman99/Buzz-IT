// setting the strategy here
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../Models/users");

module.exports = function(passport) {
    passport.use(
        // (usernameField ha ye, password, done)
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            // Match user
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: "That email is not registered" });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Password incorrect" });
                    }
                });
            });
        })
    );

    // serialize
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // serialize user in single id islea we pass id to deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

// app.delete('/logout',(req, res)=>{res.redirect('/login') res.logout()})
// npm method-override
// app.use(methodOver('_method))
// form k action='/logout?_method=DELETE method="POST"