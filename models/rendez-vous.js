const mongoose=require('mongoose')

const rendez_vouzSchema=new mongoose.Schema({
    date : Date,
    note : String,
    valid : Boolean,
    patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    medecin : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },



    
    //medecin:{type : mongoose.Schema.Types.ObjectId, ref :'Medecin'},


}); 

const rendez_vous=mongoose.model('Contact',rendez_vouzSchema);

module.exports=rendez_vous;