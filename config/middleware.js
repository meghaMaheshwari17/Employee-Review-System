//setting up flash 
module.exports.setFlash=function(req,res,next){
    res.locals.flash={
        'success':req.flash('success'),
        'error':req.flash('error')
    }
    next(); //so next function can be called 
 }
 
 //then in index.js we will require this middleware to use it