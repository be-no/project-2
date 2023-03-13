const mongoose = require('mongoose');

const vietfoodSchema = new mongoose.Schema({ //establishes vietfood schema exists
    name: {type: String, required: true},
    taste: {type: String, required: true},
    isVeg: Boolean,
    //imageUrl: {type: String, required: true}
});

const Vietfood = mongoose.model('Vietfood', vietfoodSchema); //pushes object to mongodb

module.exports = Vietfood;