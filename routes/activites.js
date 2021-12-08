const router=require('express').Router();
const lodashsh = require('lodash');

const Activite = require('../models/activite');
const User = require('../models/user');
const Demandecoach = require('../models/demandeCoach');

const Exercice = require('../models/exercice');
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




/*router.get('',verifyToken,async (req,res)=>{
    let exercices = await Exercice.find();

    
    res.send(exercices);
}) */


router.get('',verifyToken,async (req,res)=>{
    let activites = await Activite.find().populate('patient').populate('exercices')
    let coach = await User.findById(req.userId);
    let activitess = [] ;
    activites.forEach (element =>{
        console.log('okkkk')
        console.log(element.coach.firstName)
       
        if( coach.firstName === element.coach.firstName){
            console.log(element.coach)
            activitess.push(element);
        }
    });
   
    res.send(activitess);
})

router.post('',verifyToken,async (req,res)=>{
    
    let coach = await User.findById(req.userId);
    if(!coach)
        return res.status(404).send('coach Id is not found')
    /*req.body.id=req.params.id
    req.body.firstName=coach.firstName
    req.body.lastName=coach.lastName*/

    let exercices = await Exercice.findById(req.body.exercices);
    if(!exercices){
        return res.status(404).send('exercicce Id is not found')}

        let demandes = await Demandecoach.find().populate('coach')
        
            let patients = [] ;
            let trouver = false;
            demandes.forEach (element =>{
              
                if(JSON.stringify(coach) === JSON.stringify(element.coach) ){
                    
                    
                    patients.push(element.patient);
                }
            })
            let pppp = await User.findById(req.body.patient);
            
            patients.forEach (element =>{
                
                console.log(element)
                
              
                if(pppp.firstName == element.firstName ){
                    
                    
                    console.log('raniiii')
                    trouver = true;
                }
               
            })
            if(trouver=true){

                req.body.coach= coach;
                req.body.patient = pppp;
                req.body.exercices =exercices;
                
let activite = await new Activite(lodashsh.pick(req.body,['description','patient','coach','exercices']))
    try {
       
       /* activite.patient=pppp;
        activite.coach=coach;
        activite.exercices = exercices; */
        
        activite = await activite.save()
    } catch (error) {
        return res.status(400).send("Error store in database: "+error.message)
    }
    res.status(201).send(activite)
    
}})





    
   
    





router.put('/:id',verifyToken,async (req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product)
        return res.status(404).send('product Id is not found')
    product=lodashsh.merge(product,req.body)
    product = await product.save()
    console.log("cava")
    res.send(product)
})


router.delete('/:id',verifyToken,async (req,res)=>{
    let exercice = await Exercice.findByIdAndDelete(req.params.id);
    if(!exercice)
        return res.status(404).send('exercice Id is not found')
    res.send(exercice)
})
////
///
//




module.exports=router