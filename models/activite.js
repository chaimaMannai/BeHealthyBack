const mongoose = require('mongoose');

const activiteSchema = new mongoose.Schema({
    description : String,
    patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    coach : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    exercices : [{ id: {type : mongoose.Schema.Types.ObjectId, ref :'Exercice'}, nom: String }]
});

const Activite = mongoose.model('Activite', activiteSchema);
module.exports = Activite