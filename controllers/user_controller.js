const validator = require('validator'); //for validating email
const User=require('../models/user');
const mongoose = require('mongoose');
// display sign in page
module.exports.signInPage = function(req,res){
    return res.render('signin',{
        title:'Sign In'
    })
}

// display sign up page
module.exports.signUpPage = function(req,res){
    return res.render('signup',{
        title:'Sign Up'
    })
}

// signing in the user  
module.exports.signIn=async function(req,res){
    try{
        // console.log(`email:${req.body.email}`);
        let user=await User.findOne({email:req.body.email}); 
        req.flash('success','Successfully signed in!');
         return res.redirect(`/dashboard/${user._id}`);
    }catch(error){
        req.flash('error','error in signing in');
        return res.redirect('/');
    }
}

// creating the user account
module.exports.createUser = async function(req, res){
    try{
        if(!validator.isEmail(req.body.email)){
            req.flash('error','Enter valid email')
            return res.redirect('back');
          }else if(req.body.password.length<2){
            req.flash('error','Password must be longer than 2 characters')
            return res.redirect('back');
          }else if(req.body.password!==req.body.confirmPassword){
            req.flash('error','Password and Confirm password must be the same')
            return res.redirect('back');
          }
        let user=await User.findOne({email:req.body.email});
        if(user){
            req.flash('error','Email already in use!');
            return res.redirect('back');
        }else{
            let role='employee';
            if(req.body.role){
               role=req.body.role;
            }
            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: role
            });
            // if the request is coming from an admin trying to create a new employee then redirect them to the dashboard
            if(req.isAuthenticated()){
                req.flash('success','Employee created successfully!');
                return res.redirect(`/dashboard/${req.user._id.toString()}`);
            }
            // else if it's a new user trying to register redirect them to sign in page
            req.flash('success','User created successfully!');
            return res.redirect('/');
        }
        
    }catch(error){
        req.flash('error','error in signing up');
        console.log(error);
        return res.redirect('back');
    }
}

// redirect to dashboard
module.exports.dashboard= async function(req, res){
    try{
        let user=await User.findById(req.params.userId); 
        if(user.role==='employee'){
            // redirect to employee dashboard
             await user.populate('assignedReviews');
              console.log(user.assignedReviews);
             return res.render('employeeDashboard',{
                title:'Employee | Dashboard',
                assignedReviews:user.assignedReviews
             });
        }else{
            // redirect to admin dashboard
            let employees=await User.find({role:'employee'});
            return res.render('adminDashboard',{
                title:'Admin | Dashboard',
                employees:employees
             });
        }
    }catch(error){
        console.log(error);
    }
    
}

// logout user
module.exports.logout=function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have logged out!');
        return res.redirect('/');
      });
}
