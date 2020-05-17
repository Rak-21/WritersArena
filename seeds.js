// var mongoose = require("mongoose"),
//     Blog = require("./models/blog"),
//     Comment = require("./models/comment");

// var data = [
//     {
//         title: "Cloud's Rest", 
//         image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
//         content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//     },
//     {
//          title: "Desert Mesa", 
//          image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
//          content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//      },
//      {
//          title: "Canyon Floor", 
//          image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
//          content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
//      }
// ]


// function seedDB(){
//     Blog.remove({},function(err){
//         if(err){
//             console.log(err);
//         } 
//         console.log("removed blogs!");

//         data.forEach(function(seed){
//             Blog.create(seed,function(err,blog){
//                 if(err){
//                     console.log(err);
//                 } else{
//                     console.log("added a new Blog");
//                     Comment.create(
//                         {
//                             text: "This place is great, but I wish there was interner",
//                             author: "Homer"
//                         },function(err, comment){
//                             if(err){
//                                 console.log(err);
//                             } else{
//                                 blog.comments.push(comment);
//                                 blog.save();
//                                 console.log("Created new Comment");
//                             }
//                         });
//                 }

//             });
//         });
//     });
// }

// module.exports = seedDB;