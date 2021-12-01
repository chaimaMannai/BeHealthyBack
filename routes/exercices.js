const router=require('express').Router();
const lodashsh = require('lodash');


var path = require('path')
var multer = require('multer')
const crypto =require('crypto')
var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })


const Exercice = require('../models/exercice');



router.get('',async (req,res)=>{
    let exercices = await Exercice.find();

    
    res.send(exercices);
})










router.post('',upload.single('image'),async (req,res)=>{
    console.log(req.body)
    
   
    let exercicePropreites = lodashsh.pick(req.body,['nom','description'])
   // console.log(req.file)
   exercicePropreites.filename=req.file.filename
   exercicePropreites.originalname=req.file.originalname
    let exercice = await new Exercice(exercicePropreites)
    
    
    try {
        exercice = await exercice.save()
    } catch (error) {
        return res.status(400).send("Error store in database: "+error.message)
    }
    res.status(201).send(exercice)
})





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