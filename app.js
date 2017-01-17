'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Restaurant = require('./models/restaurant'),
    dburl = process.env.DATABASEURL || 'mongodb://localhost/restaurants-guide',
    seedDB = require('./seeds'),
    app = express();

seedDB();
mongoose.connect(dburl, function(err, db){
    if(err){
        console.error(err);
    } else {
        console.log('Successfully conected to DB...');
    }
});

// Restaurant.create({
//     name: 'Сытый Дракон',
//                 adress: 'ул.Пряностей д.11',
//                 image: 'assets/img/china.jpg',
//                 capacity: 30,
//                 cuisine: 'китайская кухня',
//                 description: 'Равным образом реализация намеченных плановых заданий влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Равным образом реализация намеченных плановых заданий требуют от нас анализа системы обучения кадров, соответствует насущным потребностям. Не следует, однако забывать, что постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение форм развития. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности требуют определения и уточнения форм развития. Повседневная практика показывает, что дальнейшее развитие различных форм деятельности требуют от нас анализа соответствующий условий активизации. Значимость этих проблем настолько очевидна, что рамки и место обучения кадров способствует подготовки и реализации позиций, занимаемых участниками в отношении поставленных задач.'
// }, function(err, restaurant){
//     if(err){
//         console.error(err);
//     } else {
//         console.log('New restaurant added..');
//         console.log(restaurant);
//     }
// });


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get('/', function(req, res){
    res.render('landing');
});

app.route('/restaurants')
    .get(function(req, res){
        Restaurant.find({}, function(err, allRestaurants){
            if(err){
                console.error(err);
            } else {
                res.render('index', {restaurants: allRestaurants});
            }
        });
    })
    .post(function(req, res){
        let newRestaurant = {};
        newRestaurant.name = req.body.name;
        newRestaurant.adress = req.body.adress;
        newRestaurant.cuisine = req.body.cuisine;
        newRestaurant.capacity = req.body.capacity;
        newRestaurant.description = req.body.description;
        newRestaurant.image = req.body.image;
        
        Restaurant.create(newRestaurant, function(err, createdRestaurant){
            if(err){
                console.error(err);
            } else {
                res.redirect('/restaurants');
            }
        });
    });

app.get('/restaurants/new', function(req, res){
    res.render('new.ejs');
});

app.get('/restaurants/:id', function(req, res){
    Restaurant.findById(req.params.id).populate('comments').exec(function(err, foundRestaurant){
        if(err){
            console.error(err);
        } else {
            res.render('show', {restaurant: foundRestaurant});
        }
    });
});


app.listen(process.env.PORT || 3000, function(){
    console.log('Server started...');
});