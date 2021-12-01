 const router=require('express').Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User=require('../models/user');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');


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



router.get('' ,async (req,res)=>{
    let user = await User.find();
    console.log('get')
    console.log(req.userId)
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
    let resultat = []
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

                    resultat.push(user);
                    console.log(user)
                    resultat.push(token)

                    
                    res.status(200).send(resultat)
                    
                }
            }
        }
    })
});


////////////////////////////////////




///////////////
router.post('/inscriptionPatient',async (req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10) 
    req.body.password=hashedPassword
    let user = await new User(_.pick(req.body, ['firstName', 'lastName', 'DateNaissance', 'e_mail', 'login','password','adresse',]))
    try {
        user.role="patient";
        user.poid=0.0;
        user.taille=0.0;
        user.imc=0.0;
        user = await user.save()
    } catch (error) {
        return res.status(400).send("Error store in DB: "+error.message)
    }
    res.status(201).send(user)
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : "loubk123@gmail.com",
            pass : "clubafricain"
        }
    });
    mailoptions = {
        from : 'loubk123@gmail.com',
        to : user.e_mail,
        subject : 'Inscription',
        text :'Bonjour cher patient '+ user.firstName + ', vous etes inscrit dans notre plateforme BE-Health.'
    };
    
    transporter.sendMail(mailoptions, (err, data)=>{
        if (err)
        console.log('Mail error')
        console.log('Email sent !!!!')
    });
});



router.put('/profil/:id',async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('user Id is not found')
        
        user=_.merge(user,req.body)
        user = await user.save()
    console.log("cava")
    res.send(user)
})

router.get('/profil/:id',async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('user Id is not found')
    user.imc=(user.poid/((user.taille*user.taille)*100))*100;
    user = await user.save()
    console.log("cava")
    res.send(user)
})


router.get('/medecins',async (req,res)=>{
    
    res.send(await User.find({role :"medecin"}));
});

router.get('/:id', async (req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user)
        return res.status(404).send('User Id is not found')
    res.send(user)
});


module.exports=router 