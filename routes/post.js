const mongoose =require('mongoose');
const { create } = require('./users');

// mongoose.connect("mongodb://127.0.0.1:27017/Postsdb")

const postschema = new mongoose.Schema({
 
    image:{
        type: String,
    },
    
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
      }],
    title: String,
    description: String
    
});

module.exports=mongoose.model('post',postschema);