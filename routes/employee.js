// firing up the express
const express = require('express');
const router=express.Router();

const employeeController=require('../controllers/employee_controller');

// to give feedback
router.post('/giveFeedback',employeeController.giveFeedback);
// to view all the feedbacks received
router.get('/feedbacks',employeeController.feedbacks);
module.exports= router;