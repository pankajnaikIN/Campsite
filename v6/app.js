var express       =require("express"),
    app           =express(),
    bodyParser    =require("body-parser"),
    mongoose      =require("mongoose"),
    campground    =require("./models/campground"),
    passport      =require("passport"),
    localstratergy=require("passport-local"),
    comment       =require("./models/comment"),
    user          =require("./models/user"),
    seedDB        =require("./seeds");
  
const ejsLint     = require('ejs-lint');



mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//passport configuration
app.use(require("express-session")({
    secret: "once again rusty wins",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentuser=req.user;
   next();
});
//schema setup
// var campgroundSchema=new mongoose.Schema({
//     name:String,
//     image:String,
//     description:String
// });


// var campground = mongoose.model("campground",campgroundSchema);



// campground.create(
//     {
//         name:"salmon creek",
//         image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png",
//         description:"Salmon creek is the place name"
//     },function(err, campground){
//         if(err){
//             console.log("error");
//         }else{
//             console.log("newly created");
//             console.log(campground);
//         }
//     });





    // campground.create(
    // {
    //     name:"balam lick",
    //     image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"
    // },function(err, campground){
    //     if(err){
    //         console.log("error");
    //     }else{
    //         console.log("newly created");
    //         console.log(campground);
    //     }
    // });
    
    
    
    
    
// var campgrounds= [
//         {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
//         {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
//         {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
//         {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
//         {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"}
//         ]
        
app.get("/",function(req,res){
    res.render("landing");
});





app.get("/campgrounds", function(req,res){
    //get all campgrounds from DB
    campground.find({},function(err, allcampgrounds){
        if(err){
            console.log("err");
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});





app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new.ejs");
});


app.get("/campgrounds/:id",function(req,res){
    //find the campground with provided id
    campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log(err);
        }else{
          res.render("campgrounds/show",{campground:foundcampground});  
        }
    });
    
});







app.post("/campgrounds", function(req,res){
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



//comments
app.get("/campgrounds/:id/comments/new",isloggedin, function(req,res){
    //find campground by ID
    campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    }); 
});

app.post("/campgrounds/:id/comments",isloggedin, function(req,res){
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            })
        }
    }); 
});

//auth routes
//show register
app.get("/register",function(req,res){
    res.render("register");
});

//handle signup logic
app.post("/register",function(req,res){
   var newuser=new user({username: req.body.username});
   user.register(newuser, req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
          res.redirect("/campgrounds"); 
       });
   })
});

//show login form
app.get("/login",function(req,res){
   res.render("login"); 
});
//handling login logic
app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
});
//logout route
app.get("/logout",function(req,res){
   req.logout();
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("yelpcamp server has started"); 
});