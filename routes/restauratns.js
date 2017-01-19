'use strict';

let express = require('express'),
    Restaurant = require('../models/restaurant'),
    router = express.Router();

router.route('/')
    .get(function(req, res){
        Restaurant.find({}, function(err, allRestaurants){
            if(err){
                console.error(err);
            } else {
                res.render('restaurants/index', {restaurants: allRestaurants});
            }
        });
    })
    .post(function(req, res){
        Restaurant.create(req.body.restaurant, function(err, createdRestaurant){
            if(err){
                console.error(err);
            } else {
                res.redirect('/');
            }
        });
    });

router.get('/new', isLoggedIn, function(req, res){
    res.render('restaurants/new');
});

router.get('/:id', function(req, res){
    Restaurant.findById(req.params.id).populate('comments').exec(function(err, foundRestaurant){
        if(err){
            console.error(err);
        } else {
            res.render('restaurants/show', {restaurant: foundRestaurant});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;