"use strict";

var path = process.cwd();

module.exports = function(app, passport) {
    
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.sendFile(path + "/public/homeNLI.html");
        }
    }
    
    app.get("/", isLoggedIn, function(req, res) {
        res.sendFile(path + "/public/homeLI.html");
    });
    
    app.get("/auth/twitter", passport.authenticate("twitter"));
    
    app.get("/auth/twitter/callback", passport.authenticate("twitter", {
        successRedirect: "/",
        failureRedirect: "/"
    }));
    
    app.get("/twitter-logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });
    
};