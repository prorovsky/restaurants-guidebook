'use strict';

let express = require('express'),
    Restaurant = require('../models/restaurant'),
    middleware = require('../middleware'),
    router = express.Router();

router.get('/', function(req, res){
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.error(err);
        } else {
            res.render('restaurants/index', {restaurants: allRestaurants});
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req, res){
    let author = {
        id: req.user._id,
        username: req.user.username
    };

    let newRestaurant = {} 
        newRestaurant = req.body.restaurant;
        newRestaurant.author = author;
    
    Restaurant.create(newRestaurant, function(err, createdRestaurant){
        if(err){
            console.error(err);
        } else {
            res.redirect('/restaurants');
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req, res){
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

router.get('/:id/edit', middleware.checkRestaurantOwner, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        
        res.render('restaurants/edit', {restaurant: foundRestaurant});
    });
});

router.put('/:id', middleware.checkRestaurantOwner, function(req, res){
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
        if(err){
            res.redirect('/restaurants');
        } else {
            res.redirect(`/restaurants/${req.params.id}`);
        }
    });
});

router.delete('/:id', middleware.checkRestaurantOwner, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/restaurants');
        }
        res.redirect('/restaurants');
    })
});

module.exports = router;