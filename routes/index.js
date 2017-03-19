"use strict";

var path = process.cwd();
var Image = require("../models/images");

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
    
    app.get("/getdisplayname", isLoggedIn, function(req, res) {
        var displayName = req.user.twitter.displayName;
        res.json({ "user": displayName });
    });
    
    app.get("/myimages", isLoggedIn, function(req, res) {
        res.sendFile(path + "/public/myimages.html");
    });
    
    app.post("/saveimage", isLoggedIn, function(req, res) {
        var title = req.body.ImageTitle;
        var url = req.body.ImageUrl;
        var user = req.user.twitter.username;
        var name = req.user.twitter.displayName;
        
        var newImage = new Image();
        
        newImage.image.title = title;
        newImage.image.url = url;
        newImage.image.user = user;
        newImage.image.name = name;
        
        newImage.save(function (err) {
            if (err) throw err;
        });
        
        res.json({ "status": "saved", newImage });
    });
    
    app.get("/allimages", function(req, res) {
        Image.find({}, function(err, docs) {
            if (err) console.log (err);
            res.json(docs);
        });
    });
    
    app.get("/getmyimages", isLoggedIn, function(req, res) {
        var user = req.user.twitter.username;
        Image.find({ "image.user": user }, function(err, docs) {
            if (err) console.log (err);
            res.json(docs);
        });
    });
    
    app.get("/removeimage/:id", isLoggedIn, function(req, res) {
        var user = req.user.twitter.username;
        var id = req.params.id;
        Image.findById(id, function(err, doc) {
            if (err) throw(err);
            if (doc.image.user === user) {
                Image.findByIdAndRemove(id, function(err) {
                    if (err) throw err;
                    res.json({ "status": "deleted" });
                });
            }
        });
    });
    
    app.get("/user/:user", function(req, res) {
        if (req.isAuthenticated()) {
            res.sendFile(path + "/public/userLI.html");
        } else {
            res.sendFile(path + "/public/userNLI.html");
        }
    });
    
    app.get("/userimages/:user", function(req, res) {
        var user = req.params.user;
        Image.find({ "image.user": user }, function(err, docs) {
            if (err) console.log (err);
            res.json(docs);
        });
    });
};