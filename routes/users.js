 const router=require('express').Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User=require('../models/user');
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


router.post('',async (req,res)=>{
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'dateNaissance', 'e_mail', 'login','password', 'role', 'poid', 'taille', 'adresse', 'specialite']))

    let hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
    


    try {
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
});





router.post('/login', (req, res) =>{
    console.log('hiii')
    let userData = req.body;
    User.findOne({login: userData.login},async (error, user) =>{
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
                console.log(user.password)
                let compare = await bcrypt.compare(req.body.password, user.password)
                if(!compare)
                {
                    console.log('Invalid Password')
                    res.status(401).send('Invalid Password')
                }
                else
                {
                    console.log('login validé')
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