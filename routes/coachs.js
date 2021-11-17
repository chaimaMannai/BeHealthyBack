const router = require('express').Router();
const _= require('lodash');
const User = require('../models/user');
const nodemailer = require('nodemailer');



router.get('', async (req,res)=>{
    let users = await User.find();
    let coachs = [];

    users.forEach(element => {
        if (element.role == 'coach')
        {
            coachs.push(element)
        }
        
    });
    res.send(coachs)
});

router.get('/:id', async (req,res)=>{
    let coach = await User.findById(req.params.id);
    if(!coach)
        return res.status(404).send('Coach Id is not found')
    res.send(coach)
});


router.post('',async (req,res)=>{
    req.body.role = 'coach';
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'adresse','specialite']))
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
        text :'Bonjour '+ user.firstName + ', vous etes inscrit dans notre plateforme comme un coach, votre login est : '
        + user.login +', votre mot de passe est : '+user.password
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });
});



router.put('/:id', async (req,res)=>{
    let coach = await User.findById(req.params.id);
    if(!coach)
        return res.status(404).send('Coach Id is not found')
    /* if(req.body.title)
        course.title = req.body.title */
    coach = _.merge(coach,req.body);
    coach = await coach.save();
    res.send(coach)
});

router.delete('/:id', async (req,res)=>{
    let coach = await User.findByIdAndDelete(req.params.id);
    if(!coach)
        return res.status(404).send('Medecin Id is not found')
    res.send(coach)
})


module.exports=router 