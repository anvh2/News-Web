var db = require('../utils/db')

module.exports = {
    // get category by name
    catByName: catName => {
        return db.load(`select * from category where name='${catName}'`);
    },
    all: () => {
        return db.load('select * from category order by name');
    },
    allWithNumberOfNews: () => {
        return db.load(`
        select c.cid, c.name, count(n.nid) as number_of_news
        from category c left join news n on c.cid=n.nid
        group by c.cid, c.name
        `);
    },
    allByuid: uid =>{
        return db.load(`select * from category where uid = ${uid}`);
    },
    single: id => {
        return db.load(`select * from category where cid = ${id}`);
    },
    add: entity => {
        return db.add('category', entity);
    },
    update: entity => {
        return db.update('category', 'cid', entity);
    },
    delete: id => {
        return db.update('category', 'cid', id);
    }
}