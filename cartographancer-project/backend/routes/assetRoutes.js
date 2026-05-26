const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const auth = require('../middleware/auth');

router.get('/stock', assetController.getStockAssets);
router.get('/my', auth, assetController.getUserAssets);
router.post('/', auth, assetController.uploadAsset);
router.delete('/:id', auth, assetController.deleteAsset);

module.exports = router;