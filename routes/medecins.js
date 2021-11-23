const router = require('express').Router();
const _= require('lodash');
const User = require('../models/user');
const Rdv = require('../models/rendezVous');
const nodemailer = require('nodemailer');

/* router.get('/rdv',async(req,res)=>{
    console.log("rdv");
    let rdvs = await Rdv.find();
    res.send(rdvs) 
})
 */
router.get('/patient/:id',async (req,res)=>{
    console.log("yesssss");
    let rdvs = await Rdv.find();
    let patients = [] ;
    rdvs.forEach (element =>{
        if( element.medecin.id == req.params.id){
            patients.push(element.patient);
        }
    });
    res.send(patients)
}
)



router.get('', async (req,res)=>{
    let users = await User.find();
    let medecins = [];
    users.forEach(element => {
        if (element.role == 'medecin')
        {
            medecins.push(element)
        }
        
    });
    res.send(medecins)
});


router.get('/:id', async (req,res)=>{
    let medecin = await User.findById(req.params.id);
    if(!medecin)
        return res.status(404).send('Coach Id is not found')
    res.send(medecin)
});



router.post('',async (req,res)=>{
    req.body.role = 'medecin';
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'adresse']));
    
    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)

    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : "loubk123@gmail.com",
            pass : "clubafricain"
        }
    });
    
    
    let mailoptions = {
        from : 'loubk123@gmail.com',
        to : user.e_mail,
        subject : 'Inscription',
        text :'Bonjour '+ user.firstName + ', vous etes inscrit dans notre plateforme comme un medecin, votre login est : '
        + user.login +', votre mot de passe est : '+user.password
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });
});


router.put('/:id', async (req,res)=>{
    let madecin = await User.findById(req.params.id);
    if(!madecin)
        return res.status(404).send('Medecin Id is not found')
    /* if(req.body.title)
        course.title = req.body.title */
        madecin = _.merge(madecin,req.body);
        madecin = await madecin.save();
    res.send(madecin)
})


router.delete('/:id', async (req,res)=>{
    let medecin = await User.findByIdAndDelete(req.params.id);
    if(!medecin)
        return res.status(404).send('Medecin Id is not found')
    res.send(medecin)
})


module.exports=router 