'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    dburl = process.env.DATABASEURL || 'mongodb://localhost/restaurants-guide',
    app = express();


mongoose.connect(dburl, function(err, db){
    if(err){
        console.error(err);
    } else {
        console.log('Successfully conected to DB...');
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

var restaurants = [
            {
                name: 'Пальчики Оближешь',
                adress: 'ул.Вкусная д.42',
                image: 'assets/img/family.jpg',
                altText: 'https://unsplash.com/photos/y3aP9oo9Pjc',
                capacity: 40,
                cuisine: 'семейный ресторан'
            },
            {
                name: 'Италиано',
                adress: 'ул.Хрустящая д.18',
                image: 'assets/img/pizza.jpg',
                altText: 'https://unsplash.com/search/food?photo=YJSOou0wt8c',
                capacity: 20,
                cuisine: 'пиццерия'
            },
            {
                name: 'Сладкоежка',
                adress: 'пр-т.Шоколадный д.7',
                image: 'assets/img/cookies.jpg',
                altText: 'https://unsplash.com/photos/oLHk_WLupSc',
                capacity: 15,
                cuisine: 'десерты'
            },
            {
                name: 'Сытый Дракон',
                adress: 'ул.Пряностей д.11',
                image: 'assets/img/china.jpg',
                altText: 'https://unsplash.com/photos/KhUCBmQKl-Q',
                capacity: 30,
                cuisine: 'китайская кухня'
            }
        ]



app.get('/', function(req, res){
    res.render('landing');
});

app.route('/restaurants')
    .get(function(req, res){
        res.render('restaurants', {restaurants: restaurants}); 
    })
    .post(function(req, res){
        let newRestaurant = {};
        newRestaurant.name = req.body.name;
        newRestaurant.adress = req.body.adress;
        newRestaurant.cuisine = req.body.cuisine;
        newRestaurant.capacity = req.body.capacity;
        newRestaurant.image = req.body.image;
        restaurants.push(newRestaurant);
        res.redirect('/restaurants');
    });

app.get('/restaurants/new', function(req, res){
    res.render('new.ejs');
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started...');
});