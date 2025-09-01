import UserModel from '../models/UserInfo.js';
import validator from 'validator';
import bcrypt from 'bcrypt';


  export async function getPage(req, res) {
    res.render('signup', {msg: 'none'});
  }

  export async function postUser(req, res, next) {
    const errors = [];
    if(!validator.isEmail(req.body.email)) {
      errors.push({msg: 'not a valid email for reg'});
    }
    if(!validator.isLength(req.body.password, {min: 0})) {
      errors.push({msg: 'password must be at least 8 chars long'});
    }
    if(req.body.password !== req.body.confirmPassword) {
      errors.push({msg: 'passwords do not match'});
    }
    if(errors.length) {
      req.flash('errors', errors);
      return res.redirect('../signup');
    }

    req.body.email = validator.normalizeEmail(req.body.email, {gmail_remove_dots: false});

    const hashPass = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
      email: req.body.email,
      password: hashPass
    })

    try{
      const isUserPresent = await UserModel.findOne({ email: req.body.email })
      if(isUserPresent) {
        console.error('an account with that email/username already exists')  
        //req.flash('errors', {msg: 'an account with that email/username already exists'});
          return res.redirect('../signup')
      }else{
        await user.save();
        req.logIn(user, (err) => {
          if (err) { return next(err) }
          res.redirect('/setDates')
        })
      }
    }catch (error){
      console.error('Error:', error);
    }
    

    // UserModel.findOne({$or: [
    //   //{username: req.body.username},
    //   {email: req.body.email}
    // ]}, (err, doc) => {
    //   if(err) return next(err);
    //   if(doc) {
    //     req.flash('errors', {msg: 'an account with that email/username already exists'});
    //     return res.redirect('../signup')
    //   }
    //   user.save((err) => {
    //     if (err) { return next(err) }
    //     req.logIn(user, (err) => {
    //       if (err) {
    //         return next(err)
    //       }
    //       res.redirect('/setDates')
    //     })
    //   })
    // })

  }

  export function logout(req, res) {
    req.logout()
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
  }
