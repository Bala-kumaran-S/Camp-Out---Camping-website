const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');

// Import routes
const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/camp');
const reviewRoutes = require('./routes/review');

// Import Passport configuration
const initializePassport = require('./passport-config');

// Initialize Firebase database
const { db, admin } = require('./firebase.js');

const app = express();

// Middleware setup
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'secret', // Replace with a secure key
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
initializePassport(passport);

// Set EJS as the templating engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Routes
app.use('/', userRoutes);
app.use('/camps', campgroundRoutes);
app.use('/', reviewRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Check cookie route
app.get('/check', (req, res) => {
  const userId = req.cookies.userId;
  console.log('User ID from cookie:', userId);
  res.send(`User ID from cookie: ${userId}`);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
