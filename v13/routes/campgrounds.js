var express=require("express");
var router=express.Router();
var campground=require("../models/campground");
var middleware=require("../middleware");

router.get("/",middleware.isloggedin, function(req,res){
    //get all campgrounds from DB
    campground.find({},function(err, allcampgrounds){
        if(err){
            console.log("err");
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});





router.get("/new",middleware.isloggedin,function(req,res){
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







router.post("/",middleware.isloggedin, function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id: req.user._id,
        username:req.user.username
    }
    var newcampgrounds={name: name,price: price, image: image,description: desc, author:author}
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

//edit campgrounds
router.get("/:id/edit",middleware.checkcampgroundownership, function(req,res){
        campground.findById(req.params.id, function(err, foundcampground){
            if(err){
                res.redirect("back");
            }else{
           res.render("campgrounds/edit",{campground:foundcampground}); 
            }
           });
});
    

//update campground
router.put("/:id",middleware.checkcampgroundownership,function(req,res){
   campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedcampground){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   }); 
});
//delete campground
router.delete("/:id",middleware.checkcampgroundownership,function(req,res){
   campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       }
       res.redirect("/campgrounds");
   }) ;
});



module.exports=router;