const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
    assetId: {type: String, required: true},
    imageUrl:{ type: String, required: true},
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    rotation: { type: Number, default: 0 },
    scale: { type: Number, default: 1 },
    layer:{ type: String, enum: ['background', 'token', 'overlay'], default: 'token' }
});

const MapSchema = new mongoose.Schema({
    title:{type:String, required:true, trim:true},
    description:{type:String, trim:true, default: ''},
    creator:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    gridSize:{type:Number, default:40}, //dimensione grigli in pixel
    width:{type:Number, default:800},
    height:{type:Number, default:600},
    placements:[PlacementSchema], //array di oggetti posizionati/disegnati (canvas state)
    isPublic:{type:Boolean, default:false},
    clonedFrom:{type: mongoose.Schema.Types.ObjectId, ref:'Map', default: null}, //riferimento alla mappa originale se è una copia
    createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Map', MapSchema);