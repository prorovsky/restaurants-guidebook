'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Restaurant = require('./models/restaurant'),
    Comment = require('./models/comment'),
    dburl = process.env.DATABASEURL || 'mongodb://localhost/restaurants-guide',
    seedDB = require('./seeds'),
    app = express();

// seedDB();
mongoose.connect(dburl, function(err, db){
    if(err){
        console.error(err);
    } else {
        console.log('Successfully conected to DB...');
    }
});

app.use(require('express-session')({
    secret: 
}));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// routes
app.get('/', function(req, res){
    res.render('landing');
});

app.route('/restaurants')
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
                res.redirect('/restaurants');
            }
        });
    });

app.get('/restaurants/new', function(req, res){
    res.render('restaurants/new');
});

app.get('/restaurants/:id', function(req, res){
    Restaurant.findById(req.params.id).populate('comments').exec(function(err, foundRestaurant){
        if(err){
            console.error(err);
        } else {
            res.render('restaurants/show', {restaurant: foundRestaurant});
        }
    });
});

// comments routes
app.get('/restaurants/:id/comments/new', function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.error(err);
        } else {
            res.render('comments/new', {restaurant: restaurant});
        }
    });
});

app.post('/restaurants/:id/comments', function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    restaurant.comments.push(comment);
                    restaurant.save();
                    res.redirect(`/restaurants/${restaurant._id}`);
                }
            });
        }
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started...');
});