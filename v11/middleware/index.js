var middlewareobj={};
var campground=require("../models/campground");
var comment=require("../models/comment");
middlewareobj.checkcampgroundownership=function(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundcampground){
           if(err){
               req.flash("error","campground not found");
               res.redirect("back");
           }else{
               if(foundcampground.author.id.equals(req.user._id)){
               next(); 
               }else{
                   res.redirect("back");
               }
           }
        });
        }else{
            req.flash("error","you dont have permission");
            res.redirect("back");
        }
}

middlewareobj.checkcommentownership=function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundcomment){
       if(err){
           req.flash("error","campground not found");
           res.redirect("back");
       }else{
           if(foundcomment.author.id.equals(req.user._id)){
           next(); 
           }else{
               res.redirect("back");
           }
       }
    });
    }else{
        req.flash("error","you need to be logged in to do that");
        res.redirect("back");
    }
}

//middleware
middlewareobj.isloggedin=function(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "you need to be logged in to do that.");
    res.redirect("/login");
}




module.exports=middlewareobj;