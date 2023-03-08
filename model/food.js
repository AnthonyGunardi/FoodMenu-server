const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const foodSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    selected_by:{
        type: Array,
        default: []
    },
    total_selected:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Foods',foodSchema);
