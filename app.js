'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    Restaurant = require('./models/restaurant'),
    Comment = require('./models/comment'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    config = require('./config'),
    dburl = process.env.DATABASEURL || 'mongodb://localhost/restaurants-guide',
    seedDB = require('./seeds'),
    app = express();

let commentRoutes = require('./routes/comments'),
    restaurantRoutes = require('./routes/restaurants'),
    indexRoutes = require('./routes/index');

// reset db
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


app.set('view engine', 'ejs');
app.use(flash());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:id/comments/', commentRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started...');
});