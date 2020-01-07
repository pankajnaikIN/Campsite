var express=require("express");
var router=express.Router();
var campground=require("../models/campground");

router.get("/", function(req,res){
    //get all campgrounds from DB
    campground.find({},function(err, allcampgrounds){
        if(err){
            console.log("err");
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});





router.get("/new",function(req,res){
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







router.post("/", function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var newcampgrounds={name: name, image: image,description: desc }
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

module.exports=router;