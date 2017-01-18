'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Restaurant = require('./models/restaurant'),
    Comment = require('./models/comment'),
    config = require('./config'),
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

// passport config
app.use(require('express-session')({
    secret: process.env.SECRET || config.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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
app.get('/restaurants/:id/comments/new', isLoggedIn, function(req, res){
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.error(err);
        } else {
            res.render('comments/new', {restaurant: restaurant});
        }
    });
});

app.post('/restaurants/:id/comments', isLoggedIn, function(req, res){
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

// authenticate
app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
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

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/restaurants',
        failureRedirect: '/login'
}));

//logic route
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/restaurants');
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started...');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}