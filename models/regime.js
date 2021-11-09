const mongoose=require('mongoose');

const regimeSchema=new mongoose.Schema({
    description : String,
    duree: String,
    repas : [{ id: {type : mongoose.Schema.Types.ObjectId, ref :'Repas'}, nom: String }],
    patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    medecin : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
//repas: String,
//coach:{type : mongoose.Schema.Types.ObjectId, ref :'Coach'},




}); 

const Regime=mongoose.model('Regime',regimeSchema);

module.exports=Regime;