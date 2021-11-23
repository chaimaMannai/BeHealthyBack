const router = require('express').Router();
const _= require('lodash');
const Rdv = require('../models/rendezVous');
const User = require('../models/user');



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
    if(!rdv)
        return res.status(404).send('Rdv Id is not found')
    /* if(req.body.title)
        course.title = req.body.title */
        rdv.valid = true;
        rdv = await rdv.save();
    res.send(rdv)


})



module.exports=router 