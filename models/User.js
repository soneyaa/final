const mongoose=require('mongoose');
const UserSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      post:[ 
        {title:{
        type: String,
        required: true
    },
    description:{
      type: String,
      required: true
    },
    tag:{
      type:String
    }}]
    });
    
    const User = mongoose.model('User', UserSchema);
    
    module.exports = User;
    