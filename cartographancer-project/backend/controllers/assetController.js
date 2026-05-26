const Asset = require('../models/Asset');
const CustomAsset = require('../models/CustomAsset');

exports.getStockAssets = async (req, res, next) => {
    try {
        const assets = await Asset.find({ isStock: true });
        res.json(assets);
    } catch (err) {
        next(err);
    }
};

exports.getUserAssets = async (req, res, next) => {
    try {
        const assets = await CustomAsset.find({ userId: req.user });
        res.json(assets);
    } catch (err) {
        next(err);
    }
};

exports.uploadAsset = async (req, res, next) => {
    try {
        const { name, dataUrl, size } = req.body;
        const asset = new CustomAsset({
            name,
            userId: req.user,
            dataUrl,
            size
        });
        await asset.save();
        res.status(201).json(asset);
    } catch (err) {
        next(err);
    }
};

exports.deleteAsset = async (req, res, next) => {
    try {
        const asset = await CustomAsset.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.json({ message: 'Asset deleted' });
    } catch (err) {
        next(err);
    }
};