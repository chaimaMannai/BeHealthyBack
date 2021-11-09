const mongoose = require('mongoose');

const repasSchema = new mongoose.Schema({
    nom : String,
    glucides : Number,
    protides : Number,
    eau : Number,
    calories : Number,
});

const Repas = mongoose.model('Repas', repasSchema);

module.exports = Repas