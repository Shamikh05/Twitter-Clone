const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');
const flash = require('connect-flash');




mongoose.connect('mongodb://localhost:27017/twitter-clone', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("err"))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// To join all the static files to this folder
app.use(express.static(path.join(__dirname, '/public')));

// Middleware to parse the body data
app.use(express.urlencoded({ extended: true }))

// Middleware to parse the JSON data of post
app.use(express.json());



//Routes

const authRoutes = require('./routes/auth');

// APIs

const postApiRoute = require('./routes/api/posts');


app.use(session({
    secret: 'weneedabettersecret',
    resave: false,
    saveUninitialized: true,
}))


app.use(flash());

// Middleware from passport documentation

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()));

// To login and logout user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})


// Using routes
app.use(authRoutes);


// Using APIs
app.use(postApiRoute);




app.get('/', isLoggedIn, (req, res) => {
    res.render('home');
})



app.listen(3000, () => {
    console.log("server running at port 3000");
})