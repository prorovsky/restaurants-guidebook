'use strict';

let express = require('express'),
    passport = require('passport'),
    User = require('../models/user'),
    router = express.Router();

router.get('/', function(req, res){
    res.render('landing');
});

router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.error(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/restaurants');
        });
    });
});

router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/restaurants',
        failureRedirect: '/login'
}));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/restaurants');
});

module.exports = router;