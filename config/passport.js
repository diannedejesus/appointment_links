import lstrat from 'passport-local';
import User from '../models/UserInfo.js';
import bcrypt from 'bcrypt';


export default function(passport) {
  passport.use(new lstrat({
    usernameField: 'email' //set up usernameField to be email field in inputs
  }, async (email, password, done) => {
    try {
      const savedUser = await User.findOne({ email: email.toLowerCase()})

      if(savedUser){
        if(await bcrypt.compare(password, savedUser.password)){
          return done(null, savedUser)
        }else{
          return done(null, false, {msg: 'invalid password'})
        }
      }else{
        return done(null, false, {msg: 'user does not exist'})
      }

    } catch (error) {
      return done(error), false;
    }

  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({_id: id})

      if(user){
          done(null, user)
      }else{
          done(null, false)
      }

    } catch (error) {
        return done(error, false);
    }
  })
 }