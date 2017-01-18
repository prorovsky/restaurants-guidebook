let mongoose = require('mongoose'),
    Comment = require('./models/comment'),
    Restaurant = require('./models/restaurant');

let data = [
    {
        name: 'Пальчики Оближешь',
        adress: 'ул.Вкусная д.42',
        image: '/assets/img/family.jpg',
        capacity: 40,
        cuisine: 'семейный ресторан',
        description: 'Повседневная практика показывает, что сложившаяся структура организации влечет за собой процесс внедрения и модернизации существенных финансовых и административных условий. Задача организации, в особенности же постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании направлений прогрессивного развития.'
    },
    {
        name: 'Италиано',
        adress: 'ул.Хрустящая д.18',
        image: '/assets/img/pizza.jpg',
        capacity: 20,
        cuisine: 'пиццерия',
        description: 'Идейные соображения высшего порядка, а также укрепление и развитие структуры обеспечивает широкому кругу (специалистов) участие в формировании направлений прогрессивного развития. Не следует, однако забывать, что постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании модели развития.'
    },
    {
        name: 'Сладкоежка',
        adress: 'пр-т.Шоколадный д.7',
        image: '/assets/img/cookies.jpg',
        capacity: 15,
        cuisine: 'десерты',
        description: 'С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности в значительной степени обуславливает создание форм развития. Повседневная практика показывает, что реализация намеченных плановых заданий требуют от нас анализа дальнейших направлений развития. Разнообразный и богатый опыт консультация с широким активом представляет собой интересный эксперимент проверки существенных финансовых и административных условий. С другой стороны постоянный количественный рост и сфера нашей активности требуют определения и уточнения позиций, занимаемых участниками в отношении поставленных задач. Равным образом рамки и место обучения кадров способствует подготовки и реализации модели развития. Задача организации, в особенности же постоянное информационно-пропагандистское обеспечение нашей деятельности в значительной степени обуславливает создание направлений прогрессивного развития.'
    },
    {
        name: 'Сытый Дракон',
        adress: 'ул.Пряностей д.11',
        image: '/assets/img/china.jpg',
        capacity: 30,
        cuisine: 'китайская',
        description: 'Равным образом реализация намеченных плановых заданий влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Равным образом реализация намеченных плановых заданий требуют от нас анализа системы обучения кадров, соответствует насущным потребностям. Не следует, однако забывать, что постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение форм развития. Не следует, однако забывать, что дальнейшее развитие различных форм деятельности требуют определения и уточнения форм развития. Повседневная практика показывает, что дальнейшее развитие различных форм деятельности требуют от нас анализа соответствующий условий активизации. Значимость этих проблем настолько очевидна, что рамки и место обучения кадров способствует подготовки и реализации позиций, занимаемых участниками в отношении поставленных задач.'
    }
]

function seedDB(){
    Restaurant.remove({}, (err) => {
        if(err){
            console.error(err);
        }
        console.log('Database empty...');
        data.forEach((seed) => {
            Restaurant.create(seed, (err, createdRestaurant) => {
                if(err){
                    console.error(err);
                } else {
                    console.log('added a restaurant');
                    Comment.create({ text: 'Все было вкусно!', author: 'Аноним'}, (err, comment) => {
                        if(err){
                            console.error(err);
                        } else {
                            createdRestaurant.comments.push(comment);
                            createdRestaurant.save();
                            console.log('Comment created...');
                        }
                    });
                }
            });
        });
    });
    
}

module.exports = seedDB;
