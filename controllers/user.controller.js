var userModel = require('../models/user.model');
var passport = require('passport')
var bcrypt = require('bcrypt')
var utils = require('../utils/utils')
var moment = require('moment');
var mailer = require('../utils/mailer')

module.exports = {
  // get user by user id
  getUserById: (req, res, uid, callback) =>{
    userModel.single(uid).then((user) => {
        callback(user);
    })
},

  getUserByName: (req, res) => {
    return res.send(userModel.singleByUserName("editor"));
  },

  login: (req, res, next) => {
    if (req.method === 'GET') {
      if (res.locals.isAuthenticated == false) {
        return res.render('account-layout', {
          type: 'login'
        })
      } else {
        return res.redirect('/');
      }
    } else if (req.method === 'POST') {
      passport.authenticate('local', (err, user, info) => {
        if (err)
          return next(err);

        if (!user) {
          return res.render('account-layout', {
            type: 'login',
            err_message: info.message
          })
        }

        req.logIn(user, err => {
          if (err)
            return next(err);
          req.user = user;

          return res.redirect('/');
        });
      })(req, res, next);
    }
  },

  register: (req, res, next) => {
    if (req.method === 'GET') {
      return res.render('account-layout', {
        type: 'register'
      })
    } else if (req.method === 'POST') {
      var saltRounds = 10;
      var encryptPass = bcrypt.hashSync(req.body.password, saltRounds)
      const EXPIRE_DATE = 7;

      var entity = {
        username: req.body.username,
        password: encryptPass,
        salt: "null",
        role: "subs",
        name: req.body.name,
        status: "activated",
        pen_name: "",
        email: req.body.email,
        dob: req.body.dob,
        expire_date: utils.getExpireDateTimeString(EXPIRE_DATE)
      }

      userModel.add(entity).then(id => {
        var session = req.session
        session.username = entity.username
        session.id = id

        return res.redirect('/login')
      }).catch(err => {
        console.log(err)
        return res.redirect('/register')
      })
    }
  },

  profile: (req, res, next) => {
    if (req.method === 'GET') {
      userModel.single(req.params.id).then(rows => {
        var dob = moment(rows[0].dob, '').format('YYYY-MM-DD')
        var joindate = moment(rows[0].create_date, '').format('YYYY-MM-DD')
        return res.render('dashboard/profile', {
          layout: "layouts/dashboard",
          user: rows[0],
          dob: dob,
          joindate: joindate,
          type: 'profile'
        });
      })
    } else if (req.method == 'POST') {

    }
  },

  edit: (req, res, next) => {
    if (req.method === 'GET') {
      userModel.single(req.params.id).then(rows => {
        var dob = moment(rows[0].dob, '').format('YYYY-MM-DD')
        var joindate = moment(rows[0].create_date, '').format('YYYY-MM-DD')
        return res.render('profile', {
          user: rows[0],
          dob: dob,
          joindate: joindate,
          type: 'edit-profile'
        });
      })
    } else if (req.methd === 'POST') {
      var entity = {
        uid: req.params.id,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        dob: req.body.dob,
      }

      userModel.update(entity).then(id => {
        return res.redirect('/account/profile/' + req.params.id)
      })
    }
  },

  change: (req, res, next) => {
    if (req.method === 'GET') {
      userModel.single(req.params.id).then(rows => {
        return res.render('profile', {
          user: rows[0],
          type: 'change-pass'
        });
      })
    } else if (req.methd === 'POST') {
      res.send('change post')
      if (req.body.newpassword !== req.body.confirm) {
        return res.send('Your new password is incorrect')
        //return res.redirect('/')
      }

      userModel.single(req.params.id).then(rows => {
        var ret = bcrypt.compareSync(req.body.oldpassword, rows[0].password);
        if (ret) {
          return res.send('Your old password is incorrect')
          //return res.redirect('/')
        }
      })

      var saltRounds = 10;
      var encryptPass = bcrypt.hashSync(req.body.newpassword, saltRounds)

      var entity = {
        uid: req.params.id,
        password: encryptPass
      }

      userModel.update(entity).then(id => {
        return res.redirect('/account/profile/' + req.params.id)
      })
    }
  },

  logout: (req, res, next) => {
    if (req.method === 'GET') {

    } else if (req.methd === 'POST') {
      req.logOut();
      return res.redirect('/login');
    }
  },

  forgot: (req, res, next) => {
    if (req.method === 'GET') {
      return res.render('account-layout', {
        type: 'forgot'
      })
    } else if (req.methd === 'POST') {
      mailer.changePass(req.body.email)
      res.redirect('/login')
    }
  },

  confirm: (req, res, next) => {
    if (req.method === 'GET') {
      var email = req.params.email
      userModel.singleByEmail(email).then(rows => {
        var saltRounds = 10;
        var encryptPass = bcrypt.hashSync('123456', saltRounds)

        var entity = {
          uid: rows[0].uid,
          password: encryptPass
        }

        userModel.update(entity).then(id => {
          return res.redirect('/login')
        })
      })

      return res.redirect('/login')
    } else if (req.methd === 'POST') {

    }
  }
}