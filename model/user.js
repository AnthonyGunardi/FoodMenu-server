const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    
    email:{
        type:String,
        required:true,
    },
    wa_number:{
        type:String,
        required:true
    },
    foodChoice: {
        type:String,
        required:false
    },
    drinkChoice: {
        type:String,
        required:false        
    },
    hasSubmit: {
        type:Boolean,
        required:false,
        default: false       
    },
    
});
module.exports = mongoose.model('Users',userSchema);