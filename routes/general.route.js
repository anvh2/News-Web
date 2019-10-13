var express = require('express');
var newsModel = require('../models/news.model')
var pageController = require('../controllers/page.controller')
var userCtrl = require('../controllers/user.controller')
var mailer = require('../utils/mailer')
var utils = require('../utils/utils')
var commentController = require('../controllers/comment.controller')
var router = express.Router();

router.get('/', (req, res, next) => {
     pageController.run(req, res, next, "home")
})

router.post('/search', (req, res, next) => {
    pageController.run(req, res, next, "search")
})

router.get('/category', (req, res, next) => {
    return res.redirect('/category/all')
})

router.get('/news', (req, res, next) => {
    return res.redirect('/category/all')
})

router.get('/category/:name', (req, res, next) => {
    pageController.run(req, res, next, "category")
})

router.get('/tag', (req, res, next) => {
    return res.redirect('/tag/all');
})

router.get('/tag/:name', (req, res, next) => {
    pageController.run(req, res, next, "tag");
})

router.get('/news/:nid', (req, res, next) => {
    console.log(req.params.nid)
    pageController.run(req, res, next, "news");
})

router.get('/login', (req, res, next) => {
    userCtrl.login(req, res)
})

router.post('/login', (req, res, next) => {
    userCtrl.login(req, res, next)
})

router.get('/register', (req, res, next) => {
    userCtrl.register(req, res)
})

router.post('/register', (req, res, next) => {
    userCtrl.register(req, res, next)
})

router.get('/forgot', (req, res, next) => {
    userCtrl.forgot(req, res, next)
})

router.post('/forgot', (req, res, next) => {
    mailer.changePass(req.body.email)
    return res.redirect('/login')
})

//confirm change password
router.get('/confirm/:email', (req, res, next) => {
    userCtrl.confirm(req, res, next)
})
router.post('/news/:nid/upload-comment', (req, res, next) => {
    commentController.addComment(req, res);
})
module.exports = router;
