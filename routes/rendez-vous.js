const router=require('express').Router();
const lodashsh = require('lodash');
const Rdv=require('../models/rendez-vous');
const User=require('../models/user');

router.post('',async (req,res)=>{
   
    let medecin = await User.findById(req.body.medecin);
    if(!medecin)
        return res.status(404).send('medecin Id is not found')
    if(medecin.role!=="medecin")
    {
        return res.status(404).send('role is not medecin') 
    }
    else
    {
    let rdv = await new Rdv(lodashsh.pick(req.body,['nomPatient','medecin']))
    try {
        rdv = await rdv.save()
    } catch (error) {
        return res.status(400).send("Error store in database: "+error.message)
    }
    
    
    res.status(201).send(rdv)
}})

router.get('',async (req,res)=>{
    let rdvs = await Rdv.find().populate('medecin')

    
    res.send(rdvs);
})

module.exports=router