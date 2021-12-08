const router=require('express').Router();
const lodashsh = require('lodash');
const ContactMark = require('../models/contactMarketing');
//var cors = require('cors')
//var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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




router.get('',verifyToken,async (req,res)=>{
    let contact = await ContactMark.find();
    res.send(contact);
})

router.get('/numberContactMarketing',verifyToken,async (req,res)=>{
    let contacts = await ContactMark.find();
    nb=contacts.length
    console.log(nb)
    res.send((nb).toString());
    
    
  })

router.get('/:id',async (req,res)=>{
    let contact = await ContactMark.findById(req.params.id);
    if(!contact)
        return res.status(404).send('product Id is not found')
    res.send(contact)
})
// search by city or region 



router.post('',async (req,res)=>{
   
    let contact = await new ContactMark(lodashsh.pick(req.body,['name','email','city','region','subject','message']))
    try {
      contact = await contact.save()
    } catch (error) {
        return res.status(400).send("Error store in database: "+error.message)
    }
    res.status(201).send(contact)
 
})
   



/*
router.put('/:id',async (req,res)=>{
    let customer = await Customer.findById(req.params.id);
    if(!customer)
        return res.status(404).send('film Id is not found')
    customer=lodashsh.merge(customer,req.body)
    customer= await Customer.save()
    res.send(customer)
})*/


router.delete('/:id',verifyToken,async (req,res)=>{
    let contact = await ContactMark.findByIdAndDelete(req.params.id);
    if(!contact)
        return res.status(404).send('product Id is not found')
    res.send(contact)
})



module.exports=router