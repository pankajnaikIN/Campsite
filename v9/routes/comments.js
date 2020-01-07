var express=require("express");
var router=express.Router({mergeParams: true});
var campground=require("../models/campground");
var comment=require("../models/comment");


//comments
router.get("/new",isloggedin, function(req,res){
    //find campground by ID
    campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    }); 
});




router.post("/",isloggedin, function(req,res){
   //lookup campground using ID
   campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //create new comment
            //connect new comment to campground
            //redirect campground to show page
            comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            })
        }
    }); 
});

//middleware
function isloggedin(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports=router;