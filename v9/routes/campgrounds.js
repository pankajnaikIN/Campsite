var express=require("express");
var router=express.Router();
var campground=require("../models/campground");

router.get("/",isloggedin, function(req,res){
    //get all campgrounds from DB
    campground.find({},function(err, allcampgrounds){
        if(err){
            console.log("err");
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});





router.get("/new",isloggedin,function(req,res){
    res.render("campgrounds/new.ejs");
});


router.get("/:id",function(req,res){
    //find the campground with provided id
    campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log(err);
        }else{
          res.render("campgrounds/show",{campground:foundcampground});  
        }
    });
    
});







router.post("/",isloggedin, function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id: req.user._id,
        username:req.user.username
    }
    var newcampgrounds={name: name, image: image,description: desc, author:author}
    // campgrounds.push(newcampgrounds);
    campground.create(newcampgrounds,function(err, newlycreated){
        if(err){
            console.log("error");
        }else{
            console.log("newly created");
            console.log(newlycreated);
        }
    });
    
    res.redirect("/campgrounds");
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