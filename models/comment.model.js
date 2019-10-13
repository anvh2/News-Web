var db = require('../utils/db')

module.exports = {
    // count comment in news by news id
    countComment: nid =>{
        return db.reload(`select count(*) as commentCount, nid from comment c
        group by nid`)
    },
    all: () => {
        return db.load('select * from comment');
    },
    single: id => {
        return db.load(`select * from comment where cmid = ${id}`);
    },
    add: entity => {
        return db.add('comment', entity);
    },
    update: entity => {
        return db.update('comment', 'cmid', entity);
    },
    delete: id => {
        return db.delete('comment', 'cmid', id);
    },
    pageByNewsId: (nid, limit, offset) => {
        return db.load(`select * 
        from comment, user 
        where user.uid = comment.uid and comment.nid = ${nid} 
        limit ${limit} offset ${offset}`);
    },
    countByNewsId: nid => {
        return db.load(`select count(*)
        from comment
        where comment.nid = ${nid}`);
    }
}