const mongoose=require('mongoose')

const contacMarketingtSchema=new mongoose.Schema({

name : String ,
email : String ,
subject : String ,
message : String ,


}); 

const contactMarketing=mongoose.model('ContactMark',contacMarketingtSchema);

module.exports=contactMarketing;