let Restaurant = require('../models/restaurant'),
    Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkRestaurantOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
            if(err){
                req.flash('error', 'Такого ресторана нет.');
                res.redirect('back');
            } else {
                if(foundRestaurant.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'У вас недостаточно прав.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'Сначала нужно авторизоваться.');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'У вас недостаточно прав.');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'Сначала нужно авторизоваться.');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Сначала нужно авторизоваться.');
    res.redirect('/login');
}

module.exports = middlewareObj;