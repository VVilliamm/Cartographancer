const express = require('express');
const router = express.Router();
const Map = require('../models/Map');
const auth = require('../middleware/auth');

router.get('/', async (req, res, next) => {
    try {
        const maps = await Map.find({ isPublic: true }).populate('creator', 'name');
        res.json(maps);
    } catch (err) {
        next(err);
    }
});

// GET /api/maps/user/:userId - Ottieni tutte le mappe di un utente specifico
router.get('/user/:userId', auth, async (req, res, next) => {
    try {
        const userMaps= await Map.find({ creator: req.params.userId });
        res.json(userMaps);
    } catch (err) {
        next(err);
    }
});

router.post('/', auth, async (req, res, next) => {
    try {
        const newMap= new Map({
            title: req.body.title,
            description: req.body.description,
            creator: req.user,
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

router.put('/:id', auth, async (req, res, next) => {
    try {
        const updatedMap = await Map.findOneAndUpdate(
            { _id: req.params.id, creator: req.user },
            { placements: req.body.placements, isPublic: req.body.isPublic, title: req.body.title, description: req.body.description },
            { new: true }
        );
        if(!updatedMap) {return res.status(404).json({ message: 'Map not found' }); }
        res.json(updatedMap);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/clone', auth, async (req, res, next) => {
    try {
        const originalMap = await Map.findById(req.params.id);
        if (!originalMap) {
            return res.status(404).json({ message: 'Map not found' });
        }
        const clonedMap = new Map({
            title: originalMap.title + ' (Clone)',
            description: originalMap.description,
            creator: req.user,
            gridSize: originalMap.gridSize,
            width: originalMap.width,
            height: originalMap.height,
            placements: originalMap.placements,
            isPublic: false,
            clonedFrom: originalMap._id,
        });
        const savedClonedMap = await clonedMap.save();
        res.status(201).json(savedClonedMap);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const deletedMap = await Map.findOneAndDelete({ _id: req.params.id, creator: req.user });
        if (!deletedMap) {
            return res.status(404).json({ message: 'Map not found' });
        }
        res.json({ message: 'Map deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;