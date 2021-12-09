const mongoose =require('mongoose');
mongoose.connect('mongodb+srv://khalilmeddeb:khalil1919@cluster0.71uoz.mongodb.net/testRegime-?retryWrites=true&w=majority',
{useNewUrlParser:true, useUnifiedTopology:true})
     .then(()=>console.log('Monogo is Up'))
     .catch(err=> console.log('Mongo is down. Raison :',err));