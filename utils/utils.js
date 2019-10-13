var newsModel = require('../models/news.model')

module.exports = {
    getExpireDateTimeString: expireDate => {
        const date = new Date();
        return date.getFullYear() + '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
            (date.getDate() + expireDate).toString().padStart(2, '0') + ' ' +
            date.getHours().toString().padStart(2, '0') + ':' +
            date.getMinutes().toString().padStart(2, '0') + ':' +
            date.getSeconds().toString().padStart(2, '0');
    },

    getLastestNewsPerTopCate: topCates => {
        topCates.forEach((element) => {
            newsModel.theLastestNewsInCate(element.cid).then(rows => {
                console.log(rows[0].title)
                news.push(rows[0])
            })
        });
    },

    getLastestNewsInTopCate: () => {
        newsModel.topCategory(10).then(cateRows => {
            cateRows.forEach((element) => {
                newsModel.theLastestNewsInCate(element.cid).then(newsRows => {
                    console.log(newsRows[0].title)
                })
            });
        }).catch(err => {
            return err
        }) 
    }
}