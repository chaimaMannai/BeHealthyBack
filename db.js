const mongoose =require('mongoose');
mongoose.connect('mongodb+srv://Chaima123:chaima123@cluster0.pv5yx.mongodb.net/BehealthyDB?retryWrites=true&w=majority',
{useNewUrlParser:true, useUnifiedTopology:true})
     .then(()=>console.log('Monogo is Up'))
     .catch(err=> console.log('Mongo is down. Raison :',err));