const router=require('express').Router();
const _ = require('lodash');
const User=require('../models/user');
const nodemailer = require('nodemailer');



router.get('',async (req,res)=>{
    res.send(await User.find());
});

router.get('/medecins',async (req,res)=>{
    
    res.send(await User.find({role :"medecin"}));
});



router.get('/:id',async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('User Id is not found')
    res.send(user)
});


router.post('',async (req,res)=>{
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'DateNaissance', 'e_mail', 'login','password', 'role', 'poid', 'taille', 'adresse', 'specialite']))
    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
});

router.post('/inscriptionPatient',async (req,res)=>{
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'DateNaissance', 'e_mail', 'login','password','adresse',]))
    try {
        user.role="patient";
        user.poid=0.0;
        user.taille=0.0;
        user.imc=0.0;
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
    mailoptions = {
        from : 'loubk123@gmail.com',
        to : user.e_mail,
        subject : 'Inscription',
        text :'Bonjour cher patient '+ user.firstName + ', vous etes inscrit dans notre plateforme BE-Health.'
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });
});

router.put('/profil/:id',async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('user Id is not found')
        
        user=_.merge(user,req.body)
        user = await user.save()
    console.log("cava")
    res.send(user)
})

router.get('/profil/:id',async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('user Id is not found')
    user.imc=(user.poid/((user.taille*user.taille)*100))*100;
    user = await user.save()
    console.log("cava")
    res.send(user)
})

//


module.exports=router