var express = require('express'),
    mongoose = require('mongoose'),
    app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/restaurants', function(req, res){
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

    res.render('restaurants', {restaurants: restaurants});
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started...');
});