var express = require('express');
var router = express.Router();
var pageController = require('../controllers/page.controller');


router.get('/dashboard/admin/account-manager', (req, res, next) => {
    pageController.runAdmin(req,res,next, 'account-manager');
});

router.post('/dashboard/admin/account-manager/edit', (req, res, next) => {
    pageController.runAdmin(req,res,next, 'account-manager/edit');
});

router.get('/dashboard/admin/news-manager', (req, res, next) => {
    pageController.runAdmin(req,res,next, 'news-manager/edit');
});

router.post('/dashboard/admin/news-manager/edit', (req, res, next) => {
    pageController.runAdmin(req,res,next, 'news-manager/edit');
});

router.get('/dashboard/admin/category-tag-manager/', (req, res, next) => {
    pageController.runAdmin(req,res,next, 'category-tag-manager');
})

router.post('/dashboard/admin/category-tag-manager/edit', (req, res, next) => {
    pageController.runAdmin(req,res,next, 'category-tag-manager/edit');
})



module.exports = router;