const mongoose =require('mongoose');
mongoose.connect('mongodb+srv://clubafricain:clubafricain@cluster0.kz8dk.mongodb.net/regimes?retryWrites=true&w=majority',
{useNewUrlParser:true, useUnifiedTopology:true})
     .then(()=>console.log('Monogo is Up'))
     .catch(err=> console.log('Mongo is down. Raison :',err));