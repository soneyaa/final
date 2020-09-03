const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const multer =require('multer');
const path =require('path');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
  
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }   

const app = express();



//Passport config
require('./config/passport')(passport);


//DB Config
const db=require('./config/keys').MongoURI;

//connect to mongoose

mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('MongoDB connected..'))
.catch(err=>console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({ extended:false }));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));





const PORT =process.env.PORT || 3000;


app.listen(PORT, console.log(`Server started on port ${PORT}`));