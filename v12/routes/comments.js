var express=require("express");
var router=express.Router({mergeParams: true});
var campground=require("../models/campground");
var comment=require("../models/comment");
var middleware=require("../middleware");



//comments
router.get("/new",middleware.isloggedin, function(req,res){
    //find campground by ID
    campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    }); 
});




router.post("/",middleware.isloggedin, function(req,res){
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
                    req.flash("error","something went wrong");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","successfully added comment");
                    res.redirect("/campgrounds/"+ campground._id);
                }
            })
        }
    }); 
});

router.get("/:comment_id/edit",middleware.checkcommentownership,function(req,res){
    // res.send("edit route");
    comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id, comment:foundcomment});
        }
    });
});

router.put("/:comment_id",middleware.checkcommentownership,function(req,res){
   comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedcomment){
      if(err){
          res.redirect("back");
      } else{
          res.redirect("/campgrounds/"+req.params.id);
      }
   });
});
//comment destroy route
router.delete("/:comment_id",middleware.checkcommentownership,function(req,res){
   //findById and Remove
   comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      } else{
          req.flash("success","comment deleted");
          res.redirect("/campgrounds/"+req.params.id);
      }
   });
});



module.exports=router;