const mongoose= require('mongoose');

const CustomAssetSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    dataUrl:{type:String, required:true},
    size:{type:Number, required:true}, //dimensione del file in byte (max 2MB = 2097152 byte)
    createdAt:{type:Date, default:Date.now}
});

CustomAssetSchema.index({ userId: 1}); //index per ottimizzare le query per utente

module.exports = mongoose.model('CustomAsset', CustomAssetSchema);