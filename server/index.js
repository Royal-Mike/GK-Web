const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressHbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5555;

const nocache = require('nocache');

// Use nocache middleware to prevent caching
app.use(nocache());

// Serve static files from the /client/assets directory
app.use(express.static(path.join(__dirname, '../client/assets')));

// Configure handlebars as the view engine
app.engine('hbs', expressHbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '../client/views/layouts/'),
    partialsDir: path.join(__dirname, '../client/views/partials/'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: helpers,  // Use helpers here
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../client/views'));

// Middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Home page route with redirection if authenticated
app.get('/', redirectIfAuthenticated, (req, res) => {
    res.render('index', { layout: false });
});

// Routes for authentication
app.use('/', require('./routes/authRoute'));

// Routes for account management
app.use('/account', require('./routes/accountRoute'));

// Routes for authenticated user's home view
app.use('/home', require('./routes/homeRoute'));

// Routes for user profile
app.use('/profile', require('./routes/userRoute'));

// Routes for projects
app.use('/project', require('./routes/projectRoute'));

// Routes for board
app.use('/board', require('./routes/boardRoute'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Server error!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
