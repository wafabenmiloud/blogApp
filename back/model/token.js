const mongoose = require("mongoose");

const tokenShema = mongoose.Schema({
   
    token:{
        type:String,
        required:true
    }
})
const token = mongoose.model('token',tokenShema);
module.exports = token;