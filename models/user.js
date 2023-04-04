// creating a schema for user:- employee/admin
const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true, //email is a required property
        unique:true //should be unique 
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['employee','admin'],
        default:'employee'
    },
    assignedReviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      reviewsFromOthers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Review',
        },
      ],

},{ 
    timestamps:true
});

const User=mongoose.model('User',userSchema);

module.exports =User;