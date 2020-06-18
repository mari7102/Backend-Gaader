require('dotenv').config();

const cors = require('cors');
const express = require('express');


const app = express();
const PORT = process.env.PORT;



//Mongoose og DB
const mongoose = require('mongoose');


mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to Database"));

//APP
app.use(cors({ credentials: true, origin: true })); //{credentials: true, origin: true}
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 

//HEROKU - for at få set-cookie med
app.set('trust proxy', 1); // trust first proxy

//SESSION
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const TWO_HOURS = 1000 * 60 * 60 * 2;
app.use(session({
    name: process.env.SESSION_NAME,
    resave: true,
    // rolling: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db }),
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: 10000, //TWO HOURS
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
}))

//ROUTES

//INDEX
app.get('/', async (req, res) => {
    console.log("Velkommen til serveren!!")
})


//ADMIN
// app.use('*/admin*', (req, res, next) => {

//     if (!req.session.userId) {
//         return res.status(401).json({ message: 'Du har ikke adgang - du skal være logget ind' })
//     }

//     //Hvis logget ind - så bare forsæt arbejdet - next
//     next();
// })



//GAADE route - 
const gaadeRouter = require('./routes/gaader')
app.use('/gaader', gaadeRouter);


//BRUGER route - 
const brugerRouter = require('./routes/brugere');
app.use('/admin/brugere', brugerRouter);


// //AUTH route - 
// const authRouter = require('./routes/auth');
// app.use('/auth', authRouter);


app.listen(PORT, () => console.log('Server Started - lytter på port' + PORT));