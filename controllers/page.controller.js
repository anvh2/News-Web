var userController = require('./user.controller');
var newsController = require('./news.controller')
var commentController = require('./comment.controller')
var categoryModel = require('../models/category.model')
var newsModel = require('../models/news.model')
var tagModel = require('../models/tag.model')
var categoryModel = require('../models/category.model')
var tagModel = require('../models/tag.model')
var userModel = require('../models/user.model')
var bcrypt = require('bcrypt');


module.exports = {
    run: (req, res, next, page) => {
        if (page === "home") {
            if(res.locals.isAuthenticated === true){
                newsModel.theMostViewedInAllCate(true, 10).then(rows1 => {
                    newsModel.theMostViewdInWeek(true, 4).then(rows2 => {
                        newsModel.theNewestInAllCate(true, 10).then(rows3 => {
                            newsModel.theMostViewedCateWithPremium(10).then(rows4 => {
                                return res.render('home', {
                                    mostViewedInAllCate: rows1,
                                    mostViewedInWeek: rows2,
                                    latestNews: rows3,
                                    newsPerCategory: rows4,
                                })
                            })
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
            }else{
                newsModel.theMostViewedInAllCate(false , 10).then(rows1 => {
                    newsModel.theMostViewdInWeek(false , 4).then(rows2 => {
                        newsModel.theNewestInAllCate(false , 10).then(rows3 => {
                            newsModel.theMostViewedCate(10).then(rows4 => {
                                return res.render('home', {
                                    mostViewedInAllCate: rows1,
                                    mostViewedInWeek: rows2,
                                    latestNews: rows3,
                                    newsPerCategory: rows4
                                })
                            })
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        }else if (page === "news") {
            newsController.getNewsById(req, res, (news) => {
                if(news.length !== 0){
                    newsModel.update({nid: news[0].nid, views: news[0].views+1}).then(()=>{
                        tagModel.listTagByNid(news[0].nid).then((listTag) => {
                            categoryModel.single(news[0].category).then((category)=>{
                                userController.getUserById(req, res, news[0].uid, (author) => {
                                    newsController.get5NewsSameCat(req, res, news[0], (newsSameCat) => {
                                        commentController.getpageByNewsId(req, res, (commentList) => {
                                            console.log("asd")
                                            // return res.render('news', { news: {newsContent: news[0], listTag: listTag}, category: category[0], author: author[0], newsSameCat: newsSameCat, commentList: commentList });
                    
                                        })
                                        
                                    })
                                })
                            })
                        })

                    }); 
                }else{
                    return res.render('404', {layout:false});
                }
            })
        }else if (page === "category") {
            if(req.params.name === "all" || req.params.name === "Tất cả chuyên mục"){
                if(res.locals.isAuthenticated === true){
                    newsModel.getNewsByGeneral(null, null, null, 'published', null, 10, 0).then((newsList)=>{
                        var resList = [];
                        var count= 0;
                        if(newsList.length===0){
                            return res.render('category', {newsList:[], category: {image: '/defaultImage.jpg', name: 'Tất cả chuyên mục'}});
                        }
                        newsList.forEach(newsContent => {
            
                            tagModel.listTagByNid(newsContent.nid).then((listTag) => {
                                resList = [...resList, {newsContent, listTag}];
                                count++;
                                if(count==newsList.length){
                                    return res.render('category', {newsList:resList, category: {image: '/defaultImage.jpg', name: 'Tất cả chuyên mục'}});
                                }
                            })
                        });
                    });
                }else{
                    newsModel.getNewsByGeneral(null, null, null, 'published', 'normal', 10, 0).then((newsList)=>{
                        var resList = [];
                        var count= 0;
                        if(newsList.length===0){
                            return res.render('category', {newsList:[], category: {image: '/defaultImage.jpg', name: 'Tất cả chuyên mục'}});
                        }
                        newsList.forEach(newsContent => {
            
                            tagModel.listTagByNid(newsContent.nid).then((listTag) => {
                                resList = [...resList, {newsContent, listTag}];
                                count++;
                                if(count==newsList.length){
                                    return res.render('category', {newsList:resList, category: {image: '/defaultImage.jpg', name: 'Tất cả chuyên mục'}});
                                }
                            })
                        });
                    })
                }
            }else{
                if(res.locals.isAuthenticated === true){
                    categoryModel.catByName(req.params.name).then((category)=>{
                        if(category.length !== 0){
                            newsModel.getNewsByGeneral(null, category[0].cid, null, 'published', null, 10, 0).then((newsList)=>{
                                var resList = [];
                                var count= 0;
                                if(newsList.length===0){
                                    return res.render('category', {newsList:[], category: category[0]});
                                }
                                newsList.forEach(newsContent => {
                                    tagModel.listTagByNid(newsContent.nid).then((listTag) => {
                                        resList = [...resList, {newsContent, listTag}];
                                        count++;
                                        if(count==newsList.length){
                                            return res.render('category', {newsList:resList, category: category[0]});
                                        }
                                    })
                                });
                            });
                        }else{
                            return res.render('404', {layout:false});
                        } 
                    })
                }else{
                    categoryModel.catByName(req.params.name).then((category)=>{
                        if(category.length !== 0){
                            newsModel.getNewsByGeneral(null, category[0].cid, null, 'published', 'normal', 10, 0).then((newsList)=>{
                                var resList = [];
                                var count= 0;
                                if(newsList.length===0){
                                    return res.render('category', {newsList:[], category: category[0]});
                                }
                                newsList.forEach(newsContent => {
                                    tagModel.listTagByNid(newsContent.nid).then((listTag) => {
                                        resList = [...resList, {newsContent, listTag}];
                                        count++;
                                        if(count==newsList.length){
                                            return res.render('category', {newsList:resList, category: category[0]});
                                        }
                                    })
                                });
                            });
                        }else{
                            return res.render('404', {layout:false});
                        }
                    })
                }
            }
        }else if (page === "tag") {
            if(req.params.name === "all" || req.params.name === "Tất cả bài viết"){
                return res.redirect('/category/all');
            }else{
                tagModel.tagByName(req.params.name).then(tag =>{
                    if(tag.length !== 0){
                        if(res.locals.isAuthenticated === true){
                    
                            newsModel.pageNewsByTagName(req.params.name, 'published', null, 10, 0).then((newsList)=>{
                                var resList = [];
                                var count= 0;
                                if(newsList.length===0){
                                    return res.render('tag', {newsList:[], tagName: req.params.name});
                                }
                                newsList.forEach(newsContent => {
                                    tagModel.listTagByNid(newsContent.nid).then((listTag) => {
                                        resList = [...resList, {newsContent, listTag}];
                                        count++;
                                        if(count==newsList.length){
                                            return res.render('tag', {newsList:resList, tagName: req.params.name});
                                        }
                                    })
                                });
                            });
                        }else{
                            newsModel.pageNewsByTagName(req.params.name, 'published', 'normal', 10, 0).then((newsList)=>{
                                var resList = [];
                                var count= 0;
                                if(newsList.length===0){
                                    return res.render('tag', {newsList:[], tagName: req.params.name});
                                }
                                newsList.forEach(newsContent => {
                                    tagModel.listTagByNid(newsContent.nid).then((listTag) => {
                                        resList = [...resList, {newsContent, listTag}];
                                        count++;
                                        if(count==newsList.length){
                                            return res.render('tag', {newsList:resList, tagName: req.params.name});
                                        }
                                    })
                                });
                                
                                
                            })
                        }
                    }else{
                        return res.render('404', {layout: false});
                    }
                })
                
            }
        } else if (page === "search") {
            if(res.locals.isAuthenticated === true){
                newsModel.searchWithPremium(req.body.search, 0, 10).then(rows => {
                    return res.render('search', {newsList:rows})
                }).catch(err => {
                    console.log(err)
                })
            }else{
                newsModel.search(req.body.search, 0, 10).then(rows => {
                    return res.render('search', {newsList:rows})
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    },
    runSubs: (req, res, next, page) => {
        var authUser = res.locals.authUser;
        if (page === "dashboard") {
            res.render("dashboard/main", {
                layout: "layouts/dashboard",
                dashboard: "main",
                user: authUser,
            })
        } else if (page === "my-account") {
            res.render("dashboard/main", {
                layout: "layouts/dashboard",
                dashboard: "my-account",
                user: authUser,
            })
        } else if (page === "my-account/edit") {
            if (req.method === "POST") {
                var edit = req.body.edit_profile;
                var reset = req.body.reset_password;
                var entity;
                var UID = authUser.UID;
                if (edit !== undefined) {
                    var description = req.body.description;
                    var name = req.body.name;
                    var address = req.body.address;
                    var email = req.body.email;
                    var phone = req.body.phone;
                    var DOB = req.body.DOB;
                    var pen_name = null;

                    if (authUser.role === "writer") {
                        pen_name = req.body.pen_name;
                    }

                    entity = {
                        UID: UID,
                        name: name,
                        description: description,
                        address: address,
                        email: email,
                        phone: phone,
                        pen_name: pen_name,
                        DOB: DOB,
                    };

                }
                else if (reset !== undefined) {
                    var password = req.body.password;

                    var saltRounds = 10;
                    var hash = bcrypt.hashSync(password, saltRounds);

                    entity = {
                        UID: UID,
                        password: hash,
                    };

                }
                userModel.update(entity).then(function () {
                    return res.redirect('/dashboard/my-account');
                })
            } else if (page === "subscriber/subscribe") {
                if (req.method === "POST") {
                    var UID = authUser.UID;
                    var date = new Date();
                    date.setDate(date.getDate() + 7);
                    if (req.method === "POST") {
                        var entity = {
                            UID: UID,
                            expire_date: date,
                        };
                        userModel.update(entity).then(function () {
                            return res.redirect('/dashboard/my-account');
                        })
                    } else if (req.method === "GET") {

                    }
                }
            }
        }
    },
    runWriter: (req, res, next, page) => {
        var authUser = res.locals.authUser;
        if (page === 'my-news') {
            newsModel.listInRange(null, authUser.UID, null, null, null, "join", "join", null, null).then(function (newsList) {
                return res.render('dashboard/my-news', {
                    layout: "layouts/dashboard",
                    dashboard: "writer/my-news",
                    user: authUser,
                    newsList: newsList,
                })
            });
        }
        else if (page === 'my-news/edit') {
            if (req.method === "POST") {
                var addNews = req.body.add_news;
                var updateNews = req.body.update_news;
                var deleteNews = req.body.delete_news;
                var loadNews = req.body.loadNews;

                if (loadNews === '1') {
                    var nid = req.body.nid;
                    newsModel.listInRange(nid, null, null, null, "join", "join", null, null).then(function (newsList) {
                        return res.send(newsList);
                    })
                }
                else if (addNews !== undefined) {
                    var image = req.body.image;
                    if (image === '') image = null;

                    var nid = req.body.nid;
                    var uid = authUser.UID;
                    var title = req.body.title;
                    var cid = req.body.category;
                    var abstract = req.body.abstract;
                    var content = req.body.content;
                    var status = req.body.status;
                    var tags = req.body.tags;
                    tags = tags.split(',');

                    var newsEntity = {
                        nid: nid,
                        uid: uid,
                        cid: cid,
                        title: title,
                        abstract: abstract,
                        image: image,
                        status: status,
                        content: content,
                    };

                    newsModel.add(newsEntity).then(function () {
                        if (tags.length !== 0) {
                            tags.forEach(function (tag) {
                                tag = tag.trim(" ");
                                var tagEntity = {
                                    name: tag,
                                    nid: nid,
                                };
                                tagModel.update(tagEntity).then(function () {
                                    return res.redirect('/dashboard/writer/my-news');
                                })
                            })
                        } else {
                            return res.redirect('/dashboard/writer/my-news');
                        }
                    })
                }
                else if (updateNews !== undefined) {
                    var nid = req.body.nid;
                    var uid = authUser.UID;
                    var title = req.body.title;
                    var cid = req.body.category;
                    var abstract = req.body.abstract;
                    var content = req.body.content;
                    var status = req.body.status;
                    var tags = req.body.tags;
                    tags = tags.split(',');

                    var newsEntity = {
                        nid: nid,
                        uid: uid,
                        cid: cid,
                        title: title,
                        abstract: abstract,
                        status: status,
                        content: content,
                    };

                    newsModel.update(newsEntity).then(function () {
                        tagModel.listBynid(nid).then(function (tagsList) {
                            var newsCounter = 0;
                            if (tagsList.length !== 0) {
                                tagsList.forEach(function (tag) {
                                    tagModel.delete(tag.tid).then(function () {
                                        newsCounter++;
                                        if (newsCounter === tagsList.length) {
                                            var tagCounter = 0;
                                            if (tags.length === 0) {
                                                tags.forEach(function (tag) {
                                                    tag = tag.trim(" ");
                                                    var tagEntity = {
                                                        name: tag,
                                                        nid: nid,
                                                    };
                                                    tagModel.update(tagEntity).then(function () {
                                                        tagCounter++;
                                                        if (tagCounter === tags.length) return res.redirect('/dashboard/writer/my-news');
                                                    })
                                                })
                                            }
                                            else return res.redirect('/dashboard/writer/my-news');
                                        }
                                    })
                                })
                            } else {
                                if (tags.length === 0) {
                                    tags.forEach(function (tag) {
                                        tag = tag.trim(" ");
                                        var tagEntity = {
                                            name: tag,
                                            nid: nid,
                                        };
                                        tagModel.update(tagEntity).then(function () {
                                            newsCounter++;
                                            if (counter === tags.length) {
                                                return res.redirect('/dashboard/writer/my-news');
                                            }
                                        })
                                    })
                                } else return res.redirect('/dashboard/writer/my-news');
                            }
                        })
                    })
                }
                else if (deleteNews !== undefined) {
                    var nid = req.body.nid;

                    var newsEntity = {
                        nid: nid,
                        status: 'drop',
                    };
                    newsModel.update(newsEntity).then(function () {
                        res.redirect('/dashboard/writer/my-news');
                    })

                }
            }
        }
    },
    runEditor: (req, res, next, page) => {
        var authUser = res.locals.authUser;
        if (page === 'news-manager') {
            categoryModel.allByuid(authUser.uid).then(function (categories) {
                var cateCounter = 0;
                var newsList = [];
                if (categories.length !== 0) {
                    categories.forEach(function (category) {
                        newsModel.listInRange(null, null, category.cid, null, null, "join", "join", null, null).then(function (newsListByCate) {
                            cateCounter++;
                            newsList.push(newsListByCate);
                            if (cateCounter === categories.length) {
                                return res.render('dashboard/news-manager', {
                                    layout: "layouts/dashboard",
                                    dashboard: "editor/news-manager",
                                    user: authUser,
                                    newsList: newsList,
                                    categories: categories,
                                })
                            }
                        })
                    })
                } else {
                    return res.render('dashboard/news-manager', {
                        layout: "layouts/dashboard",
                        dashboard: "editor/news-manager",
                        user: authUser,
                        newsList: newsList,
                        categories: categories,
                    })
                }
            })
        } else if (page === 'news-manager/edit') {
            if (req.method === "POST") {
                var publishNews = req.body.publish_news;
                var rejectNews = req.body.reject_news;
                var loadNews = req.body.loadNews;

                if (loadNews === '1') {
                    var nid = req.body.nid;
                    newsModel.listInRange(nid, null, null, null, "join", "join", null, null).then(function (newsList) {
                        return res.send(newsList);
                    })
                }
                else if (publishNews !== undefined) {

                    var nid = req.body.nid;
                    var type = req.body.type;
                    var status = "published";
                    var tags = req.body.tags;
                    tags = tags.split(',');

                    var newsEntity = {
                        nid: nid,
                        type: type,
                        status: status,
                    };

                    newsModel.update(newsEntity).then(function () {
                        if (tags.length !== 0) {
                            tags.forEach(function (tag) {
                                tag = tag.trim(" ");
                                var tagEntity = {
                                    name: tag,
                                    nid: nid,
                                };
                                tagModel.update(tagEntity).then(function () {
                                    res.redirect('/dashboard/editor/news-manager');
                                })
                            })
                        } else {
                            res.redirect('/dashboard/editor/news-manager');
                        }
                    })
                }
                else if (rejectNews !== undefined) {
                    var nid = req.body.nid;
                    var status = "rejected";

                    var newsEntity = {
                        nid: nid,
                        status: status,
                    };

                    newsModel.update(newsEntity).then(function () {
                        res.redirect('/dashboard/editor/news-manager');
                    })
                }
            }
        }
    },
    runAdmin: (req, res, next, page) => {
        this.authenticate(res, "admin");
        var authUser = res.locals.authUser;
        if (page === "account-manager") {
            userModel.all().then(function (users) {
                return res.render("dashboard/account-manager", {
                    layout: "layouts/dashboard",
                    dashboard: "admin/account-manager",
                    users: users,
                    user: authUser,
                });
            })
        } else if (page === "account-manager/edit") {
            if (req.method === "POST") {
                var addUser = req.body.add_user;
                var updateUser = req.body.update_user;
                var deleteUser = req.body.delete_user;
                var loadUser = req.body.loadUser;


                if (loadUser === '1') {
                    var uid = req.body.uid;
                    userModel.single(uid).then(function (user) {
                        return res.send(user);
                    })
                }
                else if (addUser !== undefined) {
                    var saltRounds = 10;
                    var password = bcrypt.hashSync(req.body.password, saltRounds);

                    var avatar = req.body.avatar;
                    var username = req.body.username;
                    var description = req.body.description;
                    var name = req.body.name;
                    var address = req.body.address;
                    var email = req.body.email;
                    var phone = req.body.phone;
                    var DOB = req.body.DOB;
                    var pen_name = null;
                    var managed_cates = null;
                    var expire_date = null;
                    var role = req.body.role;

                    if (role === "writer") {
                        pen_name = req.body.pen_name;
                    } else if (role === "editor") {
                        managed_cates = req.body.managed_cates;
                    }
                    else if (role === "subscriber") {
                        expire_date = req.body.expire_date;
                    }
                    var userEntity = {
                        username: username,
                        name: name,
                        email: email,
                        DOB: DOB,
                        phone: phone,
                        address: address,
                        description: description,
                        role: role,
                        password: password,
                        avatar: avatar,
                        pen_name: pen_name,
                        expire_date: expire_date,
                    };

                    userModel.add(userEntity).then(function (uid) {
                        if (managed_cates.length !== 0) {
                            var cateCounter = 0;
                            managed_cates.forEach(function (cate) {
                                var cateEntity = {
                                    cid: cate,
                                    cate_manager: uid,
                                };
                                categoryModel.update(cateEntity).then(function () {
                                    cateCounter++;
                                    if (cateCounter === managed_cates.length)
                                        return res.redirect('/dashboard/admin/account-manager');
                                })
                                
                            })
                        }
                        else {
                            return res.redirect('/dashboard/admin/account-manager');
                        }
                    })
                }
                else if (updateUser !== undefined) {
                    var uid = req.body.uid;

                    var saltRounds = 10;
                    var password = bcrypt.hashSync(req.body.password, saltRounds);

                    var username = req.body.username;
                    var description = req.body.description;
                    var name = req.body.name;
                    var address = req.body.address;
                    var email = req.body.email;
                    var phone = req.body.phone;
                    var DOB = req.body.DOB;
                    var pen_name = null;
                    var managed_cates = null;
                    var expire_date = null;
                    var role = req.body.role;

                    if (role === "writer") {
                        pen_name = req.body.pen_name;
                    } else if (role === "editor") {
                        managed_cates = req.body.managed_cates;
                    }
                    else if (role === "subscriber") {
                        expire_date = req.body.expire_date;
                    }
                    var userEntity = {
                        uid: uid,
                        username: username,
                        name: name,
                        email: email,
                        DOB: DOB,
                        phone: phone,
                        address: address,
                        description: description,
                        role: role,
                        password: password,
                        pen_name: pen_name,
                        expire_date: expire_date,
                    };

                    userModel.update(userEntity).then(function (uid) {
                        if (managed_cates.length !== 0) {
                            var cateCounter = 0;
                            managed_cates.forEach(function (cate) {
                                var cateEntity = {
                                    cid: cate,
                                    cate_manager: uid,
                                };
                                categoryModel.update(cateEntity).then(function () {
                                    cateCounter++;
                                    if (cateCounter === managed_cates.length)
                                        return res.redirect('/dashboard/admin/account-manager');
                                })

                            })
                        }
                        else {
                            return res.redirect('/dashboard/admin/account-manager');
                        }
                    })
                }
                else if (deleteUser !== undefined) {
                    var UID = req.body.UID;
                }
            }
        }
    },
    validate: (req, res, next, page) => {

    }
};