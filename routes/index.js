var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Blog = require("../models/blog");
var middleware = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

// root route
router.get("/",function(req,res){
    res.render("landing");
});

// Register Form
router.get("/register", function(req,res){
    res.render("register");
});
//Handle sign up logic
router.post("/register",function(req,res){
    var newUser =  new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName: req.body.lastName,
        email:req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === process.env.ADMINCODE){
        newUser.isAdmin = true;
    }

     User.register(newUser,req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register",{error:err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to Writers Arena "+user.username);
            res.redirect("/blogs");
        });
     });
});


// Login Form
router.get("/login", function(req, res){
    res.render("login");
});



// Handle login logic
// router.post('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err); }
//       if (!user) { return res.redirect('/login'); }
//       req.logIn(user, function(err) {
//         if (err) { return next(err); }
//         var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/blogs';
//         delete req.session.redirectTo;
//         res.redirect(redirectTo);
//       });
//     })(req, res, next);
// });


router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login",
        failureFlash: true
    }),function(req,res){
});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you Later!")
    res.redirect("/blogs");
});



// forgot password
router.get('/forgot', function(req, res) {
    res.render('forgot');
});
router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'karvhau@gmail.com',
            pass: process.env.MAILPASS
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'karvhau@gmail.com',
          subject: 'Writers Arena Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'karvhau@gmail.com',
            pass: process.env.MAILPASS
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'karvhau@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/blogs');
    });
  });




// All Users(Peoples)
router.get("/users", function(req, res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search),"gi");
        User.find({$or:[{firstName:regex},{lastName:regex},{username:regex}]},function(err, allUsers){
            if(err){
                console.log(err);
            } else{
                if(allUsers.length < 1){
                    noMatch = "No Person match The query, Please try again !"
                }
                res.render("users/people",{users:allUsers, noMatch:noMatch});
            }
        });
    } else{
        User.find({},function(err,allUsers){
            if(err){
                console.log(err);
            } else{
                res.render("users/people",{users:allUsers, noMatch:noMatch});
            }
        });
    }
});




// User Profile

router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("error", "Account not found");
            res.redirect("/users");
        }else{
            Blog.find().where("author.id").equals(foundUser._id).exec(function(err, blogs){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("/");
                }
                res.render("users/profile", {user:foundUser, blogs:blogs});
            });
        }
    });
});


// User Profile Edit

router.get("/users/:id/edit",middleware.checkProfileOwnership, function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
        req.flash("error", "User not found");
        res.redirect("back");
    }
    res.render("users/edit", {user: foundUser});
});
});

// Update Profile

router.put("/users/:id", middleware.checkProfileOwnership, function(req, res){

  User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedBlog){
      if(err){
          req.flash("error", "User not found");
          res.redirect("/users");
      } else {
          res.redirect("/users/"+ req.params.id);
      }
  });
});





function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;