const mongoose = require('mongoose');

const activiteSchema = new mongoose.Schema({
    description : String,
    patient : {type : mongoose.Schema.Types.ObjectId, ref :'User'}, 
    coach : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    exercices : {type : mongoose.Schema.Types.ObjectId, ref :'Exercice'}, 
});

const Activite = mongoose.model('Activite', activiteSchema);
module.exports = Activite