const User = require("../models/user");
const Review = require("../models/review");
const mongoose=require("mongoose");

// display add employee page
module.exports.addEmployeePage=function(req,res){
    return res.render('addEmployee',{
        title:'Add Employee'
    })
}

// delete employee
module.exports.deleteEmployee=async function(req,res){
    try{
       let {employeeId}=req.params;
       await User.findByIdAndDelete(employeeId);
       await Review.deleteMany({ recipient: employeeId });
       await Review.deleteMany({ reviewer: employeeId });
       req.flash('success','Employee deleted successfully!');
       return res.redirect('back');
    }catch(error){
        req.flash('error','Error in deleting employee');
        return res.redirect('back');
    }
}

// display edit employee page
module.exports.editEmployeePage=async function(req,res){
    let {employeeId}=req.params;
    let employee=await User.findById(employeeId);
    return res.render('editEmployee',{
        title:'Edit Employee',
        employee:employee,
    });
}

// edit employee
module.exports.editEmployee=async function(req, res){
    try{
        console.log(req.params);
        let {employeeId}=req.params;
        let employee=await User.findById(employeeId);
        employee.name=req.body.name;
        employee.email=req.body.email;
        employee.role=req.body.role;
        employee.save();
        req.flash('success','Employee updated successfully!');
        // redirect to dashboard 
        return res.redirect(`/dashboard/${req.user._id.toString()}`);
    }catch(error){
        req.flash('error','Error in editing employee');
        return res.redirect('back');
    }
}

// assign review to employee
module.exports.assignReview=async function(req, res){
    try{
        let {employeeId}=req.params;
        console.log(req.body.recipient);
        let reviewer=await User.findById(employeeId);
        let recipient=await User.findById(req.body.recipient);
        
        await reviewer.updateOne({
            $push: { assignedReviews: recipient },
          });
        req.flash('success','Review assigned to the employee!');
        return res.redirect(`/dashboard/${req.user._id.toString()}`);
    }catch(error){
        req.flash('error','Error in assigning employee');
        return res.redirect('back');
    }
}

// display all the reviews in the page
module.exports.performanceReviewPage=async function(req, res){
    try{
        let reviews=await Review.find({}).populate('reviewer').populate('recipient');
        let users=await User.find({});
        return res.render('feedbacksAdmin',{
            title:'Performance Reviews',
            reviews:reviews,
            users:users
        })
    }catch(error){
        req.flash('error','Error in getting reviews');
        return res.redirect('back');
    }
    
}

// add review for admin
module.exports.addReview=async function(req, res){
    try{
        let reviewer=await User.findOne({email:req.body.reviewer});
        let recipient=await User.findById(req.body.recipient);
        let review=await Review.create({
            review:req.body.feedback,
            reviewer:reviewer,
            recipient:recipient
        });
        recipient.reviewsFromOthers.push(review);
        recipient.save();
        req.flash('success','Review added successfully!');
        return res.redirect(`/dashboard/${reviewer.id}/admin/performanceReviews`);
    }catch(error){
        req.flash('error','Error in deleting review');
        return res.redirect('back');
    }
}