const router = require('express').Router();
const _ = require('lodash');
const Calendrier = require('../models/calendrier');
const User = require('../models/user');



router.post('/', async (req,res)=>{
    let patient = await User.findById(req.body.patient.id);
    if(!patient)
        return res.status(404).send('Patient Id is not found')
    req.body.patient.firstName= patient.firstName
    req.body.patient.lastName=patient.lastName
    let calendrier = await new Calendrier(_.pick(req.body, ['date','patient']));
    try {
        calendrier = await calendrier.save();
    } catch (error) {
        return res.status(400).send("Error Store in DB : "+error.message)
    }

    res.status(201).send(calendrier)
})


module.exports = router