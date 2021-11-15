 const router=require('express').Router();
const _ = require('lodash');
const User=require('../models/user');



 /* router.get('',async (req,res)=>{
    res.send(await User.find());
}); */ 

router.get('/:id',async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('User Id is not found')
    res.send(user)
});


router.post('',async (req,res)=>{
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'poid', 'taille', 'adresse', 'specialite']))
    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
});

/* router.post('/medecin',async (req,res)=>{
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'adresse']))
    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
}); */

/* router.post('/coach',async (req,res)=>{
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'adresse','specialite']))
    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
}); */


 /* router.get('', async (req,res)=>{
    let users = await User.find();
    let medecins = [];

    users.forEach(element => {
        if (element.role == 'medecin')
        {
            medecins.push(element)
        }
        
    });
    res.send(medecins)
})  */


module.exports=router 