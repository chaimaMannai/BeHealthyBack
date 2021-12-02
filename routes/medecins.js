const router = require('express').Router();
const _= require('lodash');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const ver = require('./users');
const Rdv = require('../models/rendezVous');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
//import {verifyToken} from '../routes/users';


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

router.get('', /*verifyToken,*/ async (req,res)=>{ // bloquit token hnee
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


router.get('/patient/', verifyToken, async (req,res)=>{
    console.log("yesssss");
    let rdvs = await Rdv.find();
    let patients = [] ;
    rdvs.forEach (element =>{
        if( element.medecin.id == req.userId){
            patients.push(element.patient);
        }
    });
    res.send(patients)
}
)


router.get('/:id', verifyToken, async (req,res)=>{
    let medecin = await User.findById(req.params.id);
    if(!medecin)
        return res.status(404).send('Coach Id is not found')
    res.send(medecin)
});


let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : "loubk123@gmail.com",
        pass : "clubafricain"
    }
});



router.post('',async (req,res)=>{
    req.body.role = 'medecin';
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'adresse']));

    let passwd = user.password
    
    let hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
    
    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)

    /* let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : "loubk123@gmail.com",
            pass : "clubafricain"
        }
    }); */
    
    
    let mailoptions = {
        from : 'loubk123@gmail.com',
        to : user.e_mail,
        subject : 'Inscription',
        text :'Bonjour '+ user.firstName + ', vous etes inscrit dans notre plateforme comme un medecin, votre login est : '
        + user.login +', votre mot de passe est : '+passwd
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });
});


router.put('/:id', verifyToken, async (req,res)=>{
    let medecin = await User.findById(req.params.id);
    if(!medecin)
        return res.status(404).send('Medecin Id is not found')
    /* if(req.body.title)
        course.title = req.body.title */
        
        medecin = _.merge(medecin,req.body);

        let newPass = medecin.password

        let hashedPassword = await bcrypt.hash(medecin.password, 10)
        medecin.password = hashedPassword


        medecin = await medecin.save();
    res.send(medecin)

    let mailoptions = {
        from : 'loubk123@gmail.com',
        to : madecin.e_mail,
        subject : 'Inscription',
        text :'Bonjour '+ medecin.firstName + ', vos infos sont changées, votre login est : '
        + medecin.login +', votre mot de passe est : '+newPass
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });
})


router.delete('/:id', verifyToken, async (req,res)=>{
    let medecin = await User.findByIdAndDelete(req.params.id);
    if(!medecin)
        return res.status(404).send('Medecin Id is not found')
    res.send(medecin)
})


module.exports=router 