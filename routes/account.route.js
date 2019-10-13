var express = require('express');
var userCtrl = require('../controllers/user.controller')
var userModel = require('../models/user.model');
var auth = require('../middlewares/auth');

var router = express.Router();

router.get('/is-available', (req, res, next) => {
  var user = req.query.username;
  userModel.singleByUserName(user).then(rows => {
    if (rows.length > 0) {
      return res.json(false);
    }
    return res.json(true);
  })
})

router.get('/profile/:id', auth, (req, res, next) => {
  userCtrl.profile(req, res, next)
})

router.get('/edit/:id', auth, (req, res, next) => {
  userCtrl.edit(req, res, next)
})

router.post('/edit/:id', auth, (req, res, next) => {
  userCtrl.edit(req, res, next)
})

router.get('/change/:id', auth, (req, res) => {
  userCtrl.change(req, res)
})

router.post('/change/:id', auth, (req, res, next) => {
  userCtrl.change(req, res, next)
})

router.post('/logout', auth, (req, res, next) => {
  userCtrl.logout(req, res, next)
})

module.exports = router;
