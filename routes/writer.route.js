var express = require('express');
var router = express.Router();
var pageController = require('../controllers/page.controller');

router.get('/my-news', (req, res, next) => {
    pageController.runWriter(req,res,next, 'my-news');
})

router.post('/my-news/edit', (req, res, next) => {
    pageController.runWriter(req,res,next, 'my-news/edit');
})

module.exports = router;
