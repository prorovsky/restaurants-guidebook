'use strict';

let express = require('express'),
    Restaurant = require('../models/restaurant'),
    Comment = require('../models/comment'),
    router = express.Router({mergeParams: true});

// comments routes
router.get('/new', isLoggedIn, function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.error(err);
        } else {
            res.render('comments/new', {restaurant: restaurant});
        }
    });
});

router.post('/', isLoggedIn, function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    restaurant.comments.push(comment);
                    restaurant.save();
                    res.redirect(`/restaurants/${restaurant._id}`);
                }
            });
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