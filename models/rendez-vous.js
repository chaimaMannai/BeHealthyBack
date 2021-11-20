const { string, date } = require('joi');
const mongoose=require('mongoose')

const rendez_vouzSchema=new mongoose.Schema({
    
    date : Date,
    note : String,
    //validate : Boolean,
    // zedthom ena les attribus hedhoum

    nomPatient :String,
    medecin:{type : mongoose.Schema.Types.ObjectId, ref :'User'},

    //patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    //medecin : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },

    //medecin:{type : mongoose.Schema.Types.ObjectId, ref :'User'},


}); 



const rendez_vous=mongoose.model('Contact',rendez_vouzSchema);

module.exports=rendez_vous;