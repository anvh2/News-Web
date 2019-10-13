var categoryModel = require('../../models/category.model');

exports.getCategoryList = function(req, res){
    categoryModel.all()
    .then(rows => {
        res.send('Admin category page');
    //   res.render('admin/VCategories/index', {
    //     categories: rows
    //   });
    }).catch(err => {
      console.log(err);
      res.end('error occured.')
    });
}

exports.addCategory = function(req, res){
    categoryModel.add(req.body).then(id => {
        // console.log(id);
        res.render('admin/VCategories/add');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
}

exports.updateCategory = function(req, res){
    categoryModel.update(req.body).then(n => {
        res.redirect('/admin/categories');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
}

exports.editCategory = function(req, res){
    var id = req.params.id;
  if (isNaN(id)) {
    // res.render('admin/VCategories/edit', {
    //   error: true
    // });
  }

  categoryModel.single(id).then(rows => {
    if (rows.length > 0) {
      res.render('admin/VCategories/edit', {
        error: false,
        category: rows[0]
      });
    } else {
      res.render('admin/VCategories/edit', {
        error: true
      });
    }
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
}
exports.deleteCategory = function(req, res){
    categoryModel.delete(req.body.CatID).then(n => {
        res.redirect('/admin/categories');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
}