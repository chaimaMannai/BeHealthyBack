require('./db')
const express = require('express');
const user_router=require('./routes/users')
const medecin_router=require('./routes/medecins')
const coach_router=require('./routes/coachs')
const calendrier_router=require('./routes/calendrier')
const rdv_router=require('./routes/rendezVous')
const exercice_router=require('./routes/exercices')
const activite_router=require('./routes/activites')
const contactMarketing_router=require('./routes/contactMarketing')
const demandecoach_router=require('./routes/demandeCoach')


const port=process.env.PORT ||5000 
const app = express();

const cors = require('cors')
app.use(cors({
    origin : '*'
}));
app.use(express.static(__dirname + '/uploads'));

app.use(express.json())
app.use('/api/users',user_router);
app.use('/api/medecins',medecin_router);
app.use('/api/coachs',coach_router);
app.use('/api/calendriers',calendrier_router);
app.use('/api/rdv',rdv_router);
app.use('/api/exercice',exercice_router);
app.use('/api/activite',activite_router);
app.use('/api/contactMarketing',contactMarketing_router);
app.use('/api/demandecoach',demandecoach_router);



app.listen(port,()=> console.log(`Server on ${port}...`))
