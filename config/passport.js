import lstrat from 'passport-local';
import User from '../models/UserInfo.js';
import bcrypt from 'bcrypt';

//export to server.js
export default function(passport) {
   passport.use(new lstrat({
     usernameField: 'email' //set up usernameField to be email field in inputs
   }, async (email, password, done) => {
     User.findOne({email: email.toLowerCase()}, async (err, user) => {
       if(err) {return done(err);} //return callback with error only
       if(!user) {
         return done(null, false, {msg: 'user does not exist'});
         //return callback with null error, !user, and error message
       }
       try {
         if(await bcrypt.compare(password, user.password)) {
           return done(null, user);
         }
         else {
           return done(null, false, {msg: 'invalid password'})
         }
       } catch(e) {
         return done(e);
       }
     })
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
    //User.findById(id, (err, user) => done(err, user))
  })
 }