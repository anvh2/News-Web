var categoryModel = require('../models/category.model');
var tagModel = require('../models/tag.model');

module.exports = (req, res, next) => {
  categoryModel.all().then(categories => {
    res.locals.lcCategories = categories;
    tagModel.uniqueAll().then(tags => {
        res.locals.lcTags = tags;
        next();
    });
  })
};