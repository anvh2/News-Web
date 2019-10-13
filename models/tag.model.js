var db = require('../utils/db')

module.exports = {
    // get tag by tag name
    tagByName: name =>{
        return db.load(`select * from tag where name='${name}'`)
    },
    listTagByNid: nid => {
        return db.load(`select t.name as tagName from tag t where t.nid=${nid}`)
    },
    all: () => {
        return db.load('select * from tag');
    },
    single: id => {
        return db.load(`select * from tag where tid = ${id}`);
    },
    listBynid: nid => {
        return db.load('select * from tag where nid = ${nid}');
    },
    add: entity => {
        return db.add('tag', entity);
    },
    uniqueAll: () => {
        return db.load(`select name, count(*) as total from tag group by name order by total desc`)
    },
    update: entity => {
        return db.update('tag', 'tid', entity);
    },
    delete: id => {
        return db.delete('tag', 'tid', id);
    }
}