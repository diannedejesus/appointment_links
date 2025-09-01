import express from 'express'
const app = express()
import connectDB from './config/database.js'
import homeRoutes from './routes/home.js'
//const calendarRoutes = require('./routes/calendar')
import bookingRoutes from './routes/reservations.js'
//routes path
import loginRoutes from './routes/login.js' //import auth routes from local modules
import signupRoutes from './routes/signup.js'
import mongoose from 'mongoose'
import passport from 'passport' // auth middleware
import session from 'express-session' // Keeps users session logged in and creates the cookie
import MongoStore from 'connect-mongo' //saving session data in the db

import dotenv from 'dotenv'
dotenv.config({path: './config/.env'})


// Passport config
import passportConfig from './config/passport.js'
passportConfig(passport)


connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
    session({
      secret: 'keyboard cat', //this can be anything you want
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING})
      //forget about session storage now
    })
  )

// Passport middleware
app.use(passport.initialize()) //setting up passport
app.use(passport.session())

app.use('/', homeRoutes)
app.use('/setDates', bookingRoutes)
app.use('/login', loginRoutes)
app.use('/signup', signupRoutes)
//app.use('/calendar', calendarRoutes)

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on PORT: ${process.env.PORT} , you better catch it!`)
})