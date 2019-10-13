var express = require('express');
var router = express.Router();
var pageController = require('../controllers/page.controller');

router.get('/dashboard/editor/news-manager', (req, res, next) => {
    pageController.runEditor(req,res,next, 'news-manager');
})

router.post('/dashboard/editor/news-manager/edit', (req, res, next) => {
    pageController.runEditor(req,res,next, 'news-manager/edit');
})

module.exports = router;
