const mongoose=require('mongoose')

const demande_coach=new mongoose.Schema({
    date : Date,
    note : String,
    valid : Boolean,
    patient : { _id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String, e_mail: String, adresse: String , poid :Number},
    coach :  {type : mongoose.Schema.Types.ObjectId, ref :'User'}

    
    //medecin:{type : mongoose.Schema.Types.ObjectId, ref :'Medecin'},


}); 

const demandeCoach=mongoose.model('demandeCoach',demande_coach);
module.exports=demandeCoach;