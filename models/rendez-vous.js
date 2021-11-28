const { string, date } = require('joi');
const mongoose=require('mongoose')

const rendez_vouzSchema=new mongoose.Schema({
    
    date : Date,
    note : String,
    valid : Boolean,
    // zedthom ena les attribus hedhoum
    patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    medecin:{type : mongoose.Schema.Types.ObjectId, ref :'User'},

    
   // 619110a67c67c542b026aa2e   //  619399cb38d020294824e326

}); 



const rendez_vous=mongoose.model('Contact',rendez_vouzSchema);

module.exports=rendez_vous;