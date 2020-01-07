var express=require("express");
var app=express();
const ejsLint = require('ejs-lint');
var bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
 

app.set("view engine","ejs");

var campgrounds= [
        {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
        {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
        {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
        {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"},
        {name:"salmon creek", image:"https://i.pinimg.com/originals/97/7f/c8/977fc855d7e7318f1f95bba3909a942b.png"}
        ]
        
app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
})
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
})

app.post("/campgrounds", function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var newcampgrounds={name: name, image: image}
    campgrounds.push(newcampgrounds);
    
    res.redirect("/campgrounds");
})


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("yelpcamp server has started"); 
});