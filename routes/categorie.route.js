var express = require('express');
var router = express.Router();
// Créer une instance de categorie.

const categorie = require('../models/categorie');

// afficher la liste des categories.
router.get('/', async (req, res, )=> {
    try{
        const cat = await categorie.find()
        return res.status(200).json(cat)

    } catch(error){
        res.status(404).json({ message: error.message });

    }
});

router.post('/', async(req,res,)=>{
    const newcategorie = new categorie(req.body);
    try{
        await newcategorie.save()
         res.status(200).json(newcategorie)
    } catch(error){
        res.status(404).json({ message: error.message });
    }
})

router.get('/:categorieID', async (req, res, )=> {
    try{
        const cat = await categorie.findById(req.params.categorieID)
        return res.status(200).json(cat)

    } catch(error){
        res.status(404).json({ message: error.message });

    }
});

router.delete('/:categorieID', async (req, res, )=> {
    try{
        await categorie.findByIdAndDelete(req.params.categorieID)
        res.json({message : "categorie deleted successfully"})

    } catch(error){
        res.status(404).json({ message: error.message });

    }
});

router.put('/:categorieId', async (req, res)=> {
    try {
    const cat1 = await categorie.findByIdAndUpdate(
    req.params.categorieId,
    { $set: req.body },
    { new: true }
    );
    res.status(200).json(cat1);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
    

module.exports = router;