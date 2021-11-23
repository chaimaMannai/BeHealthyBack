const router = require('express').Router();
const _= require('lodash');
const Rdv = require('../models/rendezVous');
const User = require('../models/user');
const nodemailer = require('nodemailer');



let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : "loubk123@gmail.com",
        pass : "clubafricain"
    }
});



router.post('/:id',async(req,res)=>{
    let medecin = await User.findById(req.body.medecin.id);
    let patient = await User.findById(req.params.id);
    if(!patient)
        return res.status(404).send('Patient Id is not found')
    req.body.patient.id=req.params.id
    req.body.patient.firstName=patient.firstName
    req.body.patient.lastName=patient.lastName

    if(!medecin)
        return res.status(404).send('medecin Id is not found');

    req.body.medecin.firstName=medecin.firstName
    req.body.medecin.lastName=medecin.lastName
    req.body.valid = false
    let rdv = await new Rdv(_.pick(req.body,['date','note','valid','patient','medecin']))

    try {
        rdv= await rdv.save();
    } catch (error) {
        return res.status(400).send("Error Store in DB : "+error.message)
    }

    res.status(201).send(rdv)
});

router.get('/valid/:id',async(req,res)=>{
    let rdvs = await Rdv.find();
    let RM = [] ;
    rdvs.forEach(element => {
        if (element.medecin.id == req.params.id){
            if (element.valid){
                RM.push(element)
            }
        }
        
    });
    res.send(RM);
})
router.get('/nonvalid/:id',async(req,res)=>{
    let rdvs = await Rdv.find();
    let RM = [] ;
    rdvs.forEach(element => {
        if (element.medecin.id == req.params.id){
            if (!element.valid){
                RM.push(element)
            }
        }
        
    });
    res.send(RM);
})

router.delete('/:id',async(req,res)=>{
    let rdv = await Rdv.findByIdAndDelete(req.params.id);
    if(!rdv)
        return res.status(404).send('Rendez-vous Id is not found')
    res.send(rdv)

})

router.put('/:id',async(req,res)=>{
    let rdv = await Rdv.findById(req.params.id);
    let patient = await User.findById(rdv.patient.id)
    if(!rdv)
        return res.status(404).send('Rdv Id is not found')
    /* if(req.body.title)
        course.title = req.body.title */
        rdv.valid = true;
        //rdv.note = req.body.note;
        rdv = _.merge(rdv, req.body);
        rdv = await rdv.save();
    res.send(rdv)
    console.log('email user est : '+patient.e_mail)

    let mailoptions = {
        from : 'loubk123@gmail.com',
        to : patient.e_mail,
        subject : 'Rendez Vous',
        text :'Bonjour '+ rdv.patient.firstName + ', vous avez passeé un rendez vous evec le medecin '
        + rdv.medecin.firstName +' '+rdv.medecin.lastName+' le '+rdv.date+'.'
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });


})



module.exports=router 