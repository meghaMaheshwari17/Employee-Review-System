//connecting our database
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/employeeReviewSystem');

const db=mongoose.connection;

db.on('error',console.error.bind(console,'error connecting to db'));

db.once('open',function(){
    console.log('Connected to database :: MongoDB');
});

module.exports=db;