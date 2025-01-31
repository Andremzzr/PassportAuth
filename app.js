const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');

require('./config/passport')(passport);



//DB CONFIG
const db =require('./config/keys').MongoURI;

//CONNECT TO MONGO
mongoose.connect(db, {useNewUrlParser: true})



.then(() => console.log('MongoDb connected'))
.catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BODYPARSER
app.use(express.urlencoded({extended:false}));

// EXPRESS SESSION MIDLWARE
app.use(session({
    secret: 'secret',
    resave : true,
    saveUninitialized: true
}))

//PASSPORT MIDLEWARE
app.use(passport.initialize());
app.use(passport.session());



//CONECT FFLASH
app.use(flash());

//GLOBAL VARS

app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//ROUTES
const routes = require('./routes/index.js');
const users = require('./routes/users.js');

app.use('/', routes);
app.use('/users', users);


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));