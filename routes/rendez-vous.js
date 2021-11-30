const router=require('express').Router();
const lodashsh = require('lodash');
const Rdv=require('../models/rendez-vous');
const User=require('../models/user');
const nodemailer = require('nodemailer');
const Activite = require('../models/activite');

router.post('/:id',async (req,res)=>{
   
    let patient = await User.findById(req.params.id);
    if(!patient)
        return res.status(404).send('Patient Id is not found')
    //req.body.id=req.params.id
    //req.body.patient.firstName=patient.firstName
    //req.body.patient.lastName=patient.lastName

    let medecin = await User.findById(req.body.medecin);
    if(!medecin){
        return res.status(404).send('medecin Id is not found')}
    if(medecin.role!=="medecin")
    {
        return res.status(404).send('role is not medecin') 
    }
    else
    {
    let rdv = await new Rdv(lodashsh.pick(req.body,['patient','medecin','date']))
    try {
        rdv.patient=patient;
        //rdv.date=Date.now();//61994ad56a24a74e84f3a716 619399cb38d020294824e326
        rdv.valid=false;
        
        rdv = await rdv.save()
    } catch (error) {
        return res.status(400).send("Error store in database: "+error.message)
    }
    res.status(201).send(rdv)
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : "loubk123@gmail.com",
            pass : "clubafricain"
        }
    });
    mailoptions = {
        from : 'loubk123@gmail.com',
        to : rdv.emailPatient,
        subject : 'Prise de rendez-vous',
        text :'Bonjour cher patient  vous avez pris un rendez-vous avec le  dans notre plateforme BE-Health.'
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });

}})

router.get('',async (req,res)=>{
    let activites = await Activite.find()

    
    res.send(rdvs);
})

module.exports=router