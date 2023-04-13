const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy')
const flash = require('connect-flash');
const customeMiddleware = require('./config/middleware')
const { PORT,SECRET_KEY} = process.env;
const sassMiddleware = require('node-sass-middleware');


// Using sassMiddleware to import file form scss to css
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static('./assets'))
app.use(expressLayouts);

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'ER-System',
    secret: SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100),
    },
    function(err){
        console.log(err || 'connet-mongodb setup ok')
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);



app.use(flash());
app.use(customeMiddleware.setFlash);

app.use('/', require('./Routes'));

app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error in Running the Server at :${err}`)
    }
    console.log(`Port Connected Successfully to ${PORT}`)
})