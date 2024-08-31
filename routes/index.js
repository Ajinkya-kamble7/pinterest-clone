var express = require('express');
var router = express.Router();
const usermodel = require("./users");
const postmodel = require("./post");
const upload =require('./multer')

const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


// Passport configuration
passport.use(new LocalStrategy(usermodel.authenticate()));
passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());
//seralizer-->
//deserializer-->


// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Feed route
// router.get('/feed', function(req, res, next) {
//   res.render('feed');
// });


// router.post('/upload',islogged,upload.single("file") , async function(req, res, next) {
//   if(!req.file){
//     res.status(404).send("no file where given")
//   }
//   const user = await usermodel.findOne({username: req.session.passport.user})

//  const postdata= await postmodel.create({
//     image: req.file.filename,
//     imagetext: req.body.filecaption,
//     user: user._id
//   });
    
//    user.posts.push(postdata._id);
//    await user.save();
//   res.send("done");
//   console.log(postdata._id);
// });


router.post('/fileupload',islogged,upload.single("image") , async function(req, res, next) {
  const user= await usermodel.findOne({username : req.session.passport.user});//geting the current user name from req.session.passport.user
  user.profileimage =req.file.filename; // saving the current user img in profileimage req.file.filename
  await user.save();
  res.redirect('/profile')
})




router.post('/createpost',islogged,upload.single("postimage"),async function (req,res,next) {
  const data = await usermodel.findOne({username:req.session.passport.user})

  const post = await postmodel.create({
    user: data._id,
    title:req.body.title,
    description: req.body.description,
    image: req.file.filename
  })
  data.posts.push(post._id);
   await data.save();
   res.redirect("/profile")
})


// Login page
router.get('/login', function(req, res, next) {
  // Retrieve and clear the flash message for "error"
  const error = req.flash('error');

  // Render the 'login' template with both 'error' and 'name' variables
  res.render('login', { 
    error: error, 
    
  });
});

// Profile page, only if logged in
// Profile page, only if logged in
router.get('/profile', islogged, async function(req, res, next) {
 try {
  const user= 
  await usermodel.
  findOne({username : req.session.passport.user})
  .populate("posts")
  console.log(user);
res.render("profile",{user})
 } catch (error) {
  console.error('Render Error:', error);
 }
})

// router.get('/show/posts', islogged, async function(req, res, next) {
//   const user= 
//   await usermodel
//   .findOne({username : req.session.passport.user})
//   .populate("posts")
  
// res.render("show",{user})
// });

// router.get('/show/posts', (req, res) => {
//   try {
//     res.render('show');
//   } catch (error) {
//     console.error('Render Error:', error);
//     res.status(500).send('Server Error');
//   }
// });


router.get('/new', (req, res) => {
  try {
    res.render('show');
  } catch (error) {
    console.error('Render Error:', error);
    res.status(500).send('Server Error');
  }
});

router.get('/feed', islogged, async function(req, res, next) {
  try {
   const user= await usermodel.findOne({username:req.session.passport.user})
   const post =await postmodel.find()
   .populate("user")
   res.render("feed",{user,post})
  }
  catch(error){
    console.error(error);
  }
 })
 

router.get('/add', islogged, async function(req, res, next) {
  const user= await usermodel.findOne({username : req.session.passport.user});
res.render("add",{user})
})

// Register new user
router.post("/register", function(req, res) {
  const { username, email, fullname} = req.body;
  const userdata = new usermodel({ username, email, fullname });

  usermodel.register(userdata, req.body.password)
  .then(function () {
    passport.authenticate("local")(req,res,function () {
      res.redirect("/profile");
    })
  })
});

// Login user
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true // Use flash messages if you set up connect-flash
}));

// Logout user
router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Ensure user is authenticated before accessing certain routes
function islogged(req, res, next) {
  if (req.isAuthenticated()) return next(); 
  res.redirect("/login");
}




module.exports = router;