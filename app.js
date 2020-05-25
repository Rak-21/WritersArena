require('dotenv').config();


var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    session = require("express-session"),
    methodOverride = require("method-override"),
    // Blog = require("./models/Blog"),
    // Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");





// requiring routes
var commentRoutes = require("./routes/comments"),
    blogRoutes = require("./routes/blogs"),
    indexRoutes = require("./routes/index");
//===================================================================================================================

//     mongoose.connect("mongodb+srv://teamo:tempo@cluster0-jt11l.mongodb.net/test?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

//===================================================================================================================

// assign mongoose promise library and connect to database
// mongoose.Promise = global.Promise;

// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/WritersArena';
// const databaseUri = "mongodb+srv://teamo:tempo@cluster0-jt11l.mongodb.net/test?retryWrites=true&w=majority";

// mongoose.connect(databaseUri, { useMongoClient: true })
//       .then(() => console.log(`Database connected`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));

//===================================================================================================================

// mongoose.connect("mongodb://localhost/WritersArena");
// mongoose.connect("mongodb+srv://teamo:tempo@cluster0-jt11l.mongodb.net/test?retryWrites=true&w=majority");
// mongodb+srv://teamo:tempo@cluster0-jt11l.mongodb.net/test?retryWrites=true&w=majority

//===================================================================================================================
// var connectionString = 'mongodb+srv://teamo:tempo@cluster0-jt11l.mongodb.net/test?retryWrites=true&w=majority';
// mongoose.connect(connectionString);

// mongoose.connection.on('error', function(error) {
//   console.error('Database connection error:', error);
// });

// mongoose.connection.once('open', function() {
//   console.log('Database connected');
// });

//===================================================================================================================
// const MongoClient = require('mongodb').MongoClient;

// // replace the uri string with your connection string.
// const uri = "mongodb+srv://teamo:tempo@cluster0-jt11l.mongodb.net/test?retryWrites=true&w=majority"
// MongoClient.connect(uri, function(err, client) {
//    if(err) {
//         console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//    }
//    console.log('Connected...');
//    const collection = client.db("test").collection("devices");
//    // perform actions on the collection object
//    client.close();
// });
//============================================================================================================================================================
var url = process.env.WRITERSARENADB;
// "mongodb+srv://teamo:tempo@cluster0-jt11l.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected…")
})
.catch(err => console.log(err))




app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.locals.moment = require('moment');
app.use(flash());
// seedDB();   // seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Writers Arena is already on Web!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});




app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);



var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
    console.log("Writers Arena is Hosted!");
  });