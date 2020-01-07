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

var commentroutes   =require("./routes/comments"),
    campgroundroutes=require("./routes/campgrounds"),
    indexroutes      =require("./routes/index");

const ejsLint     = require('ejs-lint');



mongoose.connect("mongodb://localhost/yelp_camp_v7");
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

app.use(indexroutes);
app.use("/campgrounds",campgroundroutes);
app.use("/campgrounds/:id/comments",commentroutes);
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
        


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("yelpcamp server has started"); 
});