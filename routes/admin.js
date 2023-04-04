// firing up the express
const express = require('express');
const router=express.Router();

const adminController=require('../controllers/admin_controller');

// to add employee
router.get('/addEmployee',adminController.addEmployeePage);

// to delete employee
router.get('/deleteUser/:employeeId',adminController.deleteEmployee);

// to edit employee page
router.get('/editUserPage/:employeeId',adminController.editEmployeePage);

// to edit employee
router.post('/editUser/:employeeId',adminController.editEmployee);

// to assign review
router.post('/assignReview/:employeeId',adminController.assignReview);

// to get all the reviews in a page
router.get('/performanceReviews',adminController.performanceReviewPage);

// to let admin add review
router.post('/addReview',adminController.addReview);


module.exports= router;