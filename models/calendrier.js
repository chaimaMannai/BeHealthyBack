const mongoose = require('mongoose');

const calendrierSchema = new mongoose.Schema({
    date: Date,
    calories : Number,
    repas : [{ id: {type : mongoose.Schema.Types.ObjectId, ref :'Repas'}, nom: String }],
    patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String }

});

const Calendrier = mongoose.model('Calendrier',calendrierSchema);
module.exports = Calendrier