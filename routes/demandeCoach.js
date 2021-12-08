const router=require('express').Router();
const lodashsh = require('lodash');

const Activite = require('../models/activite');
const User = require('../models/user');
const Demandecoach = require('../models/demandeCoach');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


function verifyToken(req, res, next)
{
    if( !req.headers.authorization)
    {
        console.log('Oh nooo !! ')
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

    console.log('ID est :', req.userId)
    
}


router.post('',verifyToken,async(req,res)=>{

    let patient = await User.findById(req.userId);
    if(!patient)
        return res.status(404).send('Patient Id is not found')
  let coachIB = await User.findById(req.body.coach);
  
  if(!coachIB)
        return res.status(404).send('coach Id is not found');

  /*  req.body.coach.firstName=coach.firstName
    req.body.coach.lastName=coach.lastName */
    req.body.coach = coachIB
    req.body.valid = false 
    req.body.patient = patient
    console.log(patient)
   

   /* if(!coach)
        return res.status(404).send('coach Id is not found');

    req.body.coach.firstName=coach.firstName
    req.body.coach.lastName=coach.lastName
    req.body.valid = false */
    let demandecoach = await new Demandecoach(lodashsh.pick(req.body,['date','note','valid','patient','coach']))

    try {
        demandecoach= await demandecoach.save();
        console.log('demande',demandecoach)
    } catch (error) {
        return res.status(400).send("Error Store in DB : "+error.message)
    }

    

    res.status(201).send(demandecoach)
});

module.exports=router


