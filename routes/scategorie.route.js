var express = require('express');
var router = express.Router();

const scategorie = require('../models/scategorie');
const {authorizeRoles} = require("../middleware/authorizeRoles")
const {verifyToken} = require('../middleware/verifytoken')

router.use(verifyToken);


router.get('/',authorizeRoles("admin", "superadmin"),verifyToken, async (req, res, )=> {
    try{
        const scat = await scategorie.find().populate("categorieID");
        res.status(200).json(scat);

    } catch(error){
        res.status(404).json({ message: error.message });

    }
});

router.get('/:scategorieID', authorizeRoles("admin", "superadmin"),verifyToken, async (req, res, )=> {
    try{
        const scat = await scategorie.findById(req.params.scategorieID).populate("categorieID")
        res.status(200).json(scat);

    } catch(error){
        res.status(404).json({ message: error.message });
        

    }
});

router.post('/', authorizeRoles("admin", "superadmin"),verifyToken, async (req, res, )=> {
    const newscat = new scategorie(req.body)
    try{
        await newscat.save()
        res.status(200).json(newscat);

    } catch(error){
        res.status(404).json({ message: error.message });
        

    }
});
router.put('/:scategorieID', authorizeRoles("admin", "superadmin"),verifyToken, async (req, res, )=> {
    try{
        const scat = await scategorie.findByIdAndUpdate(
            req.params.scategorieID,
            { $set: req.body },
            { new: true }
            );
            
        res.status(200).json(scat);

    } catch(error){
        res.status(404).json({ message: error.message });
        

    }
});

router.delete('/:scategorieID', authorizeRoles("admin", "superadmin"),verifyToken, async (req, res, )=> {
    const scat = req.params.scategorieID
    try{
        await scategorie.findByIdAndDelete(scat)
        res.json({message : "scategorie deleted successfully"})

    } catch(error){
        res.status(404).json({ message: error.message });
        

    }
});

module.exports = router;