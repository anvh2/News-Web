var express = require('express');
var router = express.Router();
var pageController = require('../controllers/page.controller')

router.get('/', (req, res, next) => {
    pageController.runSubs(req,res,next, 'dashboard');
})

router.get('/my-account', (req, res, next) => {
    pageController.runSubs(req,res,next, 'my-account');
})

router.post('/my-account/edit', (req, res, next) => {
    pageController.runSubs(req,res,next, 'my-account/edit');
})

router.post('/subscriber/subscribe/', (req, res, next) => {
    pageController.runSubs(req,res,next, 'subscriber/subscribe');
})

module.exports = router;
