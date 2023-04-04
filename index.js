// fire up express
const express=require("express");
const app=express();

//imprting possport and passport-local for session cookie
 const session = require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
// importing flash for flash-messages 
const flash=require('connect-flash');
//importing custom middleware to be used (for flash)
const customMiddleware=require('./config/middleware');

//to read post requests from forms and all 
app.use(express.urlencoded({extended:true}));


// to use css
app.use(express.static('./assets'))
//use session
app.use(session({
    name :'employeeReviewSystem',
    secret:'employeeReviewSystem',
    saveUninitialized:false,
    resave:false,
    cookie :{
        maxAge :(1000 * 60 * 100)
    }

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//using flash for flash messages
app.use(flash());
//to use the custom middleware for flash messages
app.use(customMiddleware.setFlash);
// searching port 
const port=8000;

// connect to db 
const db= require('./config/mongoose');

// requiring layouts
const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);

//setting up template engine
app.set('view engine','ejs');
//searches for the views folder
app.set('views','./views');

// all routes will be executed in routes/index.js
app.use('/',require('./routes/index'));
// running the server 
app.listen(port,function(err) {
    if(err){
        console.log('Error in running the server on port '+port);
        return;
    }
    console.log('server listening on port '+port);
})
