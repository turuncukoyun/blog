var express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose");
    
    mongoose.connect("mongodb://localhost/rest_blog_app");
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    app.use(expressSanitizer());
    
    var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created:  {type: Date, default: Date.now()}
    });
    
    var Blog = mongoose.model("Blog", blogSchema);  
    
    app.get("/", function(req,res){
        res.redirect("/blogs");
    });
    app.get("/blogs", function(req,res){
        Blog.find({}, function(err,blogs){
            if(err)
                console.log(err);
            else
                res.render("index",{blogs:blogs});
        })
    });
    
    app.get("/blogs/new", function(req,res){
        res.render("new");
    })
    
    app.post("/blogs", function(req,res){
        console.log(req.body);
        req.body.blog.body = req.sanitize(req.body.blog.body);
        req.body.blog.title = req.sanitize(req.body.blog.title);
        Blog.create(req.body.blog, function(err,newBlog){
           if(err){
               console.log(err);
           } else{
               res.redirect("/blogs");
           }
        });
    })
    
    app.get("/blogs/:id",function(req,res){
        Blog.findById(req.params.id,function(err,returnedPost){
            if(err){
                res.send("error page 404");
            }
            else{
                res.render("show",{blogs:returnedPost});
            }
        })
    })
    
    app.get("/blogs/:id/edit", function(req,res){
        
        Blog.findById(req.params.id, function(err,foundData){
            if(err){
                res.redirect("/blogs");
                console.log(err);
            } else{
                res.render("edit", {blogs:foundData});
            }
        });
    })

    app.put("/blogs/:id", function(req,res){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        req.body.blog.title = req.sanitize(req.body.blog.title);
        Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog){
            if(err){
                res.redirect("/blogs");
            } else{
                res.redirect("/blogs/" + updatedBlog._id)  
            }
        });
    })
    
    app.delete("/blogs/:id", function(req,res){
        Blog.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.send("error");
            }else{
                res.redirect("/blogs");
            }
        })
    })
    
    app.get("*", function(req,res){
        res.send("error 404");
    });
  
//     Blog.create({
//         title: "Entry2",
//         image : "https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg",
//         body: "hello tdddhis the first entry"
//     });
    
    app.listen(process.env.PORT, process.env.IP, function(){
       console.log("things get started") ;
    });