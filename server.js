require('dotenv').config()

const cors = require('cors')
const express = require('express')
const app = express()
const PORT = process.env.PORT;
const session = require('express-session')

//Mongoose og DB
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session);
mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

//APP
app.use(cors()); //{credentials: true, origin: true}
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
// 

//SESSION
const TWO_HOURS = 1000 * 60 * 60 * 2;
app.use(session({
    name: process.env.SESS_NAME,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db}),
    secret: 'shhhguiet,itsasecret!',
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: false
    }
}))

//ROUTES

//ADMIN
app.use('*admin*', (req, res, next) => {

    if (!req.session.userId) {
        return res.status(401).json({ message: 'Du har ikke adgang'})
    }

    next() //Hvis logget ind - så bare forsæt arbejdet - next
})


//INDEX
//Velkommen til serveren GET http://localhost:6000/
app.get('/', (req, res) => {
    res.send("Velkommen til serveren!!")
})


//GAADE route - http://localhost:6000/gaade
const gaadeRouter = require('./routes/gaader')
app.use('/gaader', gaadeRouter)


//BRUGER route - http://localhost:6000/bruger
const brugerRouter = require('./routes/brugere')
app.use('/admin/brugere', brugerRouter)


//AUTH route - http://localhost:6000/auth
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)


app.listen(PORT, () => console.log('Server Started - lytter på port' + PORT + '.... Link: http://localhost:' + PORT));