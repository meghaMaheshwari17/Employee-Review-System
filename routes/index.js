// firing up the express
const express = require('express');
const router=express.Router();
const passport = require('passport');
const userController=require('../controllers/user_controller');

// display sign in page
router.get('/', userController.signInPage);

// display sign up page
router.get('/signup',userController.signUpPage);

// signing in user
router.post('/signin',passport.authenticate('local', { failureRedirect: '/' }),userController.signIn);

// creating user
router.post('/create-user',userController.createUser);

// displaying dashboard
router.get('/dashboard/:userId',passport.checkAuthentication,userController.dashboard);
// to route to all admin pages
router.use('/dashboard/:userId/admin',passport.checkAuthentication,require('./admin'));
// to route to all employee pages
router.use('/dashboard/:userId/employee',passport.checkAuthentication,require('./employee'));
// logging out user
router.get('/logout',userController.logout);
module.exports= router;