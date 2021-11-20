 const router=require('express').Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User=require('../models/user');


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

    console.log('token est :', req.userId)
    
}



router.get('', verifyToken ,async (req,res)=>{
    let user = await User.find();
    res.send(user)
}); 

router.get('/:id', async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('User Id is not found')
    res.send(user)
});


/* router.post('',async (req,res)=>{
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'poid', 'taille', 'adresse', 'specialite']))
    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
}); */





router.post('/login', (req, res) =>{
    console.log('hiii')
    let userData = req.body;
    User.findOne({login: userData.login}, (error, user) =>{
        if (error)
        {
            console.log(error)
        }
        else
        {
            if(!user)
            {
                res.status(401).send('Invalid login')
            }
            else
            {
                if( user.password !== userData.password)
                {
                    res.status(401).send('Invalid Password')
                }
                else
                {
                    let payload = {subject : user._id}
                    let token= jwt.sign(payload, 'secretkey')
                    res.status(200).send({token})
                    
                }
            }
        }
    })
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