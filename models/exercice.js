const mongoose = require('mongoose');

const exerciceSchema = new mongoose.Schema({
    nom : String,
    description : String,
    originalname:String,
    filename:String,
});

const Exercice = mongoose.model('Exercice',exerciceSchema);
module.exports = Exercice