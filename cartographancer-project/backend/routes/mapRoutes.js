const express = require('express');
const cors=express.Router();
const Map = require('../models/Map');

// GET /api/maps - Ottieni tutte le mapppe pubbliche (galleria)
router.get('/', async (req, res) => {
    try {
        const maps = await Map.find({ isPublic: true }).populate('author', 'username');
        res.json(maps);
    } catch (err) {
        next(err);
    }
});

// GET /api/maps/user/:userId - Ottieni tutte le mappe di un utente specifico
router.get('/user/:userId', async (req, res, next) => {
    try {
        const userMaps= await Map.find({ creator: req.params.userId });
        res.json(userMaps);
    } catch (err) {
        next(err);
    }
});

// POST /api/maps - salva una nuova mappa
router.post('/', async (req, res, next) => {
    try {
        const newMap= new Map({
            title: req.body.title,
            description: req.body.description,
            creator: req.body.creator,
            gridSize: req.body.gridSize,
            width: req.body.width,
            height: req.body.height,
            placements: req.body.placements,
            isPublic: req.body.isPublic,
        });
        const savedMap = await newMap.save();
        res.status(201).json(savedMap);
    } catch (err) {
        next(err);
    }
});

//PUT /api/maps/:id - aggiorna una mappa esistente
router.put('/:id', async (req, res, next) => {
    try {
        const updatedMap = await Map.findByIdAndUpdate(
            req.params.id,
            { placements: req.body.placements, isPublic: req.body.isPublic, title: req.body.title, description: req.body.description },
            { new: true }
        );
        if(!updatedMap) {return res.status(404).json({ message: 'Map not found' }); }
        res.json(updatedMap);
    } catch (err) {
        next(err);
    }
});

//POST /api/maps/:id/clone - clona una mappa esistente
router.post('/:id/clone', async (req, res, next) => {
    try {
        const originalMap = await Map.findById(req.params.id);
        if (!originalMap) {
            return res.status(404).json({ message: 'Map not found' });
        }
        const clonedMap = new Map({
            title: originalMap.title + ' (Clone)',
            description: originalMap.description,
            creator: req.body.newCreatorId, // utente che esegue il clonaggio
            gridSize: originalMap.gridSize,
            width: originalMap.width,
            height: originalMap.height,
            placements: originalMap.placements,
            isPublic: false, // le mappe clonate sono private di default
            clonedFrom: originalMap._id, // riferimento alla mappa originale
        });
        const savedClonedMap = await clonedMap.save();
        res.status(201).json(savedClonedMap);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/maps/:id - elimina una mappa
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedMap = await Map.findByIdAndDelete(req.params.id);
        if (!deletedMap) {
            return res.status(404).json({ message: 'Map not found' });
        }
        res.json({ message: 'Map deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;