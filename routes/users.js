const router=require('express').Router();
const _ = require('lodash');
const User=require('../models/user');



router.get('',async (req,res)=>{
    res.send(await User.find());
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

module.exports=router