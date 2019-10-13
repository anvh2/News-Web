var newsModel = require('../models/news.model')

module.exports = {
    
    // 5 bài viết mới nhất cùng chuyên mục 
    get5NewsSameCat: (req, res, news, callback) =>{
        newsModel.NewsPageByCat(news.category, 5, 0).then((news) => {
            callback(news);
        })
    },
    // lấy bài biết bằng news id
    getNewsById: (req, res, callback) => {
        newsModel.single(req.params.nid).then((news) => {
            callback(news);
        });
    },
    // bài viết nổi bật trong tuần
    getTheMostViewdInWeek: (req, res, callback) => {
        newsModel.theMostViewdInWeek(4).then((news) => {
            callback(news);
        });
    },
    // bài biết được xem nhiều nhất
    getTheMostViewedInAllCate: (req, res, callback) => {
        newsModel.theMostViewedInAllCate(10).then((news) => {
            return callback(news);
        });
    },
    // bài biết mới nhất
    gettheNewestInAllCate: (req, res, callback) => {
        newsModel.theNewestInAllCate(10).then((news) => {
            callback(news);
        });
    },
    // top 10 chuyên mục
    getTheMostViewedCate: (req, res, callback) => {
        newsModel.theMostViewedCate(10).then((news) => {
            callback(news);
        });
    },
    // danh sách tất cả bài viết
    getAllNews: (req, res, callback) => {
        newsModel.allByCat(req.params.catId).then((news) => {
            callback(news);
        })
    },
    // danh sách tất cả bài viết theo category
    getAllNewsByCate: (req, res, callback) => {
        newsModel.allByCat(req.params.catId).then((news) => {
            callback(news);
        })
    },
    // danh sách phân trang bài viết theo category 
    getPageNewsByCate: (req, res, callback) => {
        var pram = req.params;
        newsModel.pageByCat(pram.catId, 10, (pram.pageNum - 1) * 10).then((news) => {
            callback(news);
        })
    },
    // danh sách tất cả bài viết theo tag
    getAllNewsByCate: (req, res, callback) => {
        newsModel.allByCat.then((news) => {
            callback(news);
        })
    },
    // danh sách phân trang bài biết theo tag
    getPageNewsByCate: (req, res, callback) => {
        var pram = req.params;
        newsModel.pageByTag(pram.tags, 10, (pram.pageNum - 1) * 10).then((news) => {
            callback(news);
        })
    },

    //danh sach phan trang bai viet search duoc
    getPageNewsBySearch: (req, res, callback) => {
        var query = req.params.query
        newsModel.pageBySearchResult(query, 10, (pram.pageNum - 1) * 10).then(news => {
            callback(news);
        })
    }
}