const Review = require("../models/review");
const User = require("../models/user");

// give feedback by employee
module.exports.giveFeedback = async function(req, res){
   try{
      let reviewer=await User.findById(req.user._id.toString());
      let recipient=await User.findOne({email:req.body.recipient});
      let review=await Review.create({
        review:req.body.feedback,
        reviewer:reviewer,
        recipient:recipient
      });
      // delete from reviewer's pending feedbacks list
      await reviewer.updateOne({
        $pull: { assignedReviews: recipient.id },
      });
      // add to recipient's feedbacks received list
      await recipient.updateOne({
        $push:{ reviewsFromOthers : review},
      });
      req.flash('sucess','Review added successfully!');
      return res.redirect('back');
   }catch(error){
     req.flash('error', 'Error in giving feedback!');
     console.log(error);
     return res.redirect('back');
   }
}

// display feedbacks received from others in a page
module.exports.feedbacks=async function(req, res){
    try{
       let reviewer=await User.findById(req.user._id.toString()).populate({
        path: 'reviewsFromOthers',
        populate: {
          path: 'reviewer',
          model: 'User',
        },
      });
       return res.render('feedbacks',{
        title:'Feedbacks',
        feedbacksFromOthers: reviewer.reviewsFromOthers
       })
    }catch(error){
        req.flash('error', 'Error in getting feedbacks!');
        console.log(error);
        return res.redirect('back');
    }
}

