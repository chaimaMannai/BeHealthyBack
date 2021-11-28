const router=require('express').Router();
const lodashsh = require('lodash');

const Activite = require('../models/activite');
const User = require('../models/user');
const Exercice = require('../models/exercice');

router.get('',async (req,res)=>{
    let activites = await Activite.find();

    
    res.send(activites);
})










router.post('/:id',async (req,res)=>{
    let coach = await User.findById(req.params.id);
    if(!coach)
        return res.status(404).send('coach Id is not found')
    req.body.id=req.params.id
    req.body.firstName=coach.firstName
    req.body.lastName=coach.lastName

    let exercices = await Exercice.findById(req.body.exercices);
    if(!exercices){
        return res.status(404).send('exercicce Id is not found')}

    let patient = await User.findById(req.body.patient);
    if(!patient){
        return res.status(404).send('patient Id is not found')}
    if(patient.role!=="patient")
    {
        return res.status(404).send('role is not patient') 
    }
    else
    {
    let activite = await new Activite(lodashsh.pick(req.body,['description','patient','coach','exercices']))
    try {
        activite.coach=coach;
        activite = await activite.save()
    } catch (error) {
        return res.status(400).send("Error store in database: "+error.message)
    }
    res.status(201).send(activite)
    

}})
    
   
    





router.put('/:id',async (req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product)
        return res.status(404).send('product Id is not found')
    product=lodashsh.merge(product,req.body)
    product = await product.save()
    console.log("cava")
    res.send(product)
})


router.delete('/:id',async (req,res)=>{
    let exercice = await Exercice.findByIdAndDelete(req.params.id);
    if(!exercice)
        return res.status(404).send('exercice Id is not found')
    res.send(exercice)
})
////
///
//




module.exports=router