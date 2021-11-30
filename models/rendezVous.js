const mongoose=require('mongoose')

const rendez_vouzSchema=new mongoose.Schema({
    date : Date,
    note : String,
    valid : Boolean,
    patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String, e_mail: String, adresse: String },
    medecin : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String }

    
    //medecin:{type : mongoose.Schema.Types.ObjectId, ref :'Medecin'},


}); 

const rendezVous=mongoose.model('rendezVous',rendez_vouzSchema);

module.exports=rendezVous;