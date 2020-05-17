// all the middleware goes here
var User = require("../models/user");
var Blog = require("../models/blog");
var Comment = require("../models/comment");

var middlewareObj = {};


middlewareObj.checkBlogOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err || !foundBlog){
                req.flash("error", "Post not found");
                res.redirect("back");
            }else{
                if(foundBlog.author.id.equals(req.user._id)  || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)  || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkProfileOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, user){
            if(err || !user){
                req.flash("error", "User not found");
                res.redirect("back");
            }else{
                if(user._id.equals(req.user._id)  || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
      } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
      }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;