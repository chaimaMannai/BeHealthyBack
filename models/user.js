const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    firstName : String,
    lastName : String,
    DateNaissance : Date,
    e_mail : String,
    login : String ,
    password : String,
    role:String,
    poid : Number,
    taille : Number,
    adresse : String,
    specialite : String,
    
    

    
   
  

  
}); 

const User=mongoose.model('User',UserSchema);

module.exports=User;