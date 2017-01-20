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
            req.flash('error', err.message);
            res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', `Добро пожаловать в Вкусно Пахнет, ${user.username}`);
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
    req.flash('success', 'Вы вышли из системы');
    res.redirect('/restaurants');
});

module.exports = router;