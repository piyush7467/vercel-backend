let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let UserSchema=new Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});
let User=mongoose.model('User',UserSchema);
module.exports=User;
