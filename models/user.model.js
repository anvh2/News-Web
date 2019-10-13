var db = require('../utils/db')

module.exports = {
    all: () => {
        return db.load('select * from user');
    },
    single: id => {
        return db.load(`select * from user where uid = ${id}`);
    },
    singleByUserName: userName => {
        return db.load(`select * from user where username = '${userName}'`);
    },
    singleByEmail: email => {
        return db.load(`select * from user where email = '${email}'`);
    },
    add: entity => {
        return db.add('user', entity);
    },
    update: entity => {
        return db.update('user', 'uid', entity);
    },
    delete: id => {
        return db.delete('user', 'uid', id);
    }
}