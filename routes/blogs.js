var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");

//Index - show all Blogs
router.get("/",function(req,res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search),"gi");
        // get all Blogs from DB
        Blog.find({$or:[{title:regex},{"author.username":regex},{content:regex}]},function(err,allBlogs){
            if(err){
                console.log(err);
            } else{
                if(allBlogs.length < 1) {
                    noMatch = "No blogs match that query, please try again.";
                }  
                res.render("blogs/index",{blogs:allBlogs, noMatch:noMatch});
            }
        });
    } else{
        Blog.find({},function(err,allBlogs){
            if(err){
                console.log(err);
            } else{
                res.render("blogs/allBlogs",{blogs:allBlogs,noMatch:noMatch});
            }
        });
    }
});


//New - show form to create new Blog
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("blogs/new");
});

//Create - add new Blog to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    var title = req.body.title;
    var image = req.body.image;
    var content = req.body.content;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlog = {title:title, image:image, content:content, author:author};
    // Create a new Blog and save to DB
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});



//SHOW - show more info about one Blog
router.get("/:id", function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err,foundblog){
        if(err || !foundblog){
            req.flash("error", "Post not found");
            res.redirect("back");
        } else{
            console.log(foundblog);
            res.render("blogs/show",{blog:foundblog});
        }
    });
});


// Edit Blog route

router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            req.flash("error", "Post not found");
            res.redirect("back");
        }
        res.render("blogs/edit", {blog: foundBlog});
    });
});

// Update Blog route

router.put("/:id", middleware.checkBlogOwnership, function(req, res){

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            req.flash("error", "Post not found");
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

// Delete/Destroy Route
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Post not found");
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;