require('./db')
const express = require('express');

const cors =require('cors');
const user_router=require('./routes/users')
const calendrier_router=require('./routes/calendrier')
const rdv_router=require('./routes/rendez-vous')
const exercice_router=require('./routes/exercices')
const activite_router=require('./routes/activites')
const port=process.env.PORT ||5000 
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static(__dirname + '/uploads'));
app.use('/api/users',user_router);

app.use('/api/calendriers',calendrier_router);
app.use('/api/rdvs',rdv_router);
app.use('/api/exercice',exercice_router);
app.use('/api/activite',activite_router);


app.listen(port,()=> console.log(`Server on ${port}...`))