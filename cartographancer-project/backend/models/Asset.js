const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    imageUrl:{type:String, required:true},
    category:{type:String, enum:['token', 'prop'], default:'prop'},
    color:{type:String, default:'#ffffff'}, //colore di default per i token
    symbol:{type:String, default:'circle'}, //simbolo di default per i token
    isStock:{type:Boolean, default:true}, //indica se è un asset di base (stock) o personalizzato
    createdAt:{type:Date, default:Date.now}
});

AssetSchema.index({ category: 1, isStock:1 }); //index per ottimizzare le ricerche per categoria e tipo (stock/personalizzato)
module.exports = mongoose.model('Asset', AssetSchema);