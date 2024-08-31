const mongoose =require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/backendproject");
const userschema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'post',
  }],
  profileimage:{
    type:String,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  fullname:{
    type:String,
    required:true,
  },
  boards:{
    type : Array,
    default: []
  }
});

userschema.plugin(plm);


module.exports = mongoose.model('user',userschema);