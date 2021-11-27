const router = require('express').Router();
const _= require('lodash');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


function verifyToken(req, res, next)
{
    if( !req.headers.authorization)
    {
        console.log('fuuuck')
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === ('null'))
    {
        return res.status(401).send('Unauthorized request')   
    }

    let payload = jwt.verify(token, 'secretkey')
    if (!payload)
    {
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    console.log('yesss')
    next()
    
}



router.get('', verifyToken, async (req,res)=>{
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

router.get('/:id', verifyToken, async (req,res)=>{
    let coach = await User.findById(req.params.id);
    if(!coach)
        return res.status(404).send('Coach Id is not found')
    res.send(coach)
});


let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : "loubk123@gmail.com",
        pass : "clubafricain"
    }
});

router.post('', verifyToken,async (req,res)=>{
    req.body.role = 'coach';
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'adresse','specialite']))

    let passwd = user.password

    let hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword


    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
    
    
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



router.put('/:id', verifyToken, async (req,res)=>{
    let coach = await User.findById(req.params.id);
    if(!coach)
        return res.status(404).send('Coach Id is not found')
    /* if(req.body.title)
        course.title = req.body.title */
    coach = _.merge(coach,req.body);

    let newPass = coach.password

    let hashedPassword = await bcrypt.hash(coach.password, 10)
    coach.password = hashedPassword


    coach = await coach.save();
    res.send(coach)


    let mailoptions = {
        from : 'loubk123@gmail.com',
        to : coach.e_mail,
        subject : 'Inscription',
        text :'Bonjour '+ coach.firstName + ', vos infos sont changées, votre login est : '
        + coach.login +', votre mot de passe est : '+newPass
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });
});

router.delete('/:id', verifyToken, async (req,res)=>{
    let coach = await User.findByIdAndDelete(req.params.id);
    if(!coach)
        return res.status(404).send('Medecin Id is not found')
    res.send(coach)
})


module.exports=router 