var db = require('../utils/db')

module.exports = {
    
    all: () => {
        return db.load('select * from news');
    },
    
    pageNewsByTagName: (tagName, status, type, limit, offset) => {
        var option =`t.name='${tagName}' and t.nid=n.nid and c.cid=n.category`;
        
        if(status!==null){
            option+=` and n.status='${status}'`
        }
        if(type !== null){
            option+= ` and n.type='${type}'`;
        } 
        else option += ` order by n.type desc`;

        return db.load(`select n.*, c.name as categoryName from news n, tag t, category c where ${option} limit ${limit} offset ${offset};`)
    },
    countNewsByTagName: (tagName, status, type) => {
        var option =`t.name='${tagName}' and t.nid=n.nid`;
        
        if(status!==null){
            option+=` and n.status='${status}'`
        }
        if(type !== null){
            option+= ` and n.type='${type}'`;
        } 
        else option += ` order by n.type desc`;
        return db.load(`select count(*) from news n, tag t where ${option};`)
    },
    getNewsByGeneral: (nid, catId, uid, status, type, limit, offset) => {
        var option='';
        var order = ``;
        var headQuery = ``;
        
        if(nid !== null){
            option+= `n.nid=${nid} `;
        }
        if(catId !== null){
            if (option !== ``)
                option+='and ';
            option+= `n.category=${catId} `;
            headQuery = `select n.*, ca.name as categoryName from news n, category ca where ca.cid=${catId} and `
        }else{
            headQuery = `select n.*, ca.name as categoryName from news n, category ca where ca.cid=n.category and ` 
        }
        if(uid !== null){
            if (option !== ``)
                option+='and ';
            option+= `n.uid=${uid} `;
        } 
        if(status !== null){
            if (option !== ``)
                option+='and ';
            option+= `n.status='${status}' `;
        }
        if(type !== null){
            if (option !== ``)
                option+='and ';
            option+= `n.type='${type}' `;
        } 
        else order += `order by n.type desc`


        var limitation =``;
        if(limit !== null){
            limitation += `limit ${limit} `;
            if(offset !== null){
                limitation += `offset ${offset} `;
            }
        }
        

        // if (option !== ``) option = " where " + option;
        var query = `${headQuery} ${option} ${order} ${limitation}`;
        console.log(query);
        return db.load(query);
    },
    listInRange: (nid,uid,cid,status,type,join_user,join_category,limit, offset)=> {
        var option = ``;
        var join = ``;

        if (nid !== null) {
            if (option !== ``) option += ` and `;
            option += `n.nid = ${nid}`;

        }

        if (uid !== null) {
            if (option !== ``) option += ` and `;
            option += `n.uid = ${uid}`;

        }
        if (cid !== null) {
            if (option !== ``) option += ` and `;
            option += `n.cid = ${cid}`;

        }

        if (status !== null) {
            if (option !== ``) option += ` and `;
            option += `n.name = '${name}'`;

        }
        if (type !== null) {
            if (option !== ``) option += ` and `;
            option += `n.name = '${type}'`;

        }
        var select = ``;

        if (join_user === `join`) {
            join += ` inner join user u on n.uid = u.uid`;
            select += `, u.pen_name as author_name`;
        }

        if (join_category === `join`) {
            join += ` inner join category c on n.cid = c.cid`;
            select += `, c.name as category`;
        }

        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var s_limit = ``;
        if (limit !== null) s_limit = `limit ${offset},${limit}`;

        var query = `select n.* ${select} from news n ${join} ${condition} order by nid desc ${s_limit}`;

        return db.load(query);
    },

    allByCat: CatId => {
        return db.load(`select * from news where category=${CatId}`);
    },
    
    pageByCat: (CatId, limit, offset) => {
        return db.load(`select * from news where category=${CatId} limit ${limit} offset ${offset}`);
    },
    NewsPageByCat: (CatId, limit, offset) => {
        return db.load(`select * from news where category=${CatId} order by created_date desc limit ${limit} offset ${offset}`);
    },

    countByCat: CatId => {
        return db.load(`select count(*) as total from news where category = ${CatId}`);
    },

    allByTag: tags => {
        return db.load(`select * from news where tags=${tags}`);
    },

    pageByTag: (tags, limit, offset) => {
        return db.load(`select * from news where tags=${tags} limit ${limit} offset ${offset}`);
    },

    pageBySearchResult: (query, limit, offset) => {
        return db.load(`select * from news where match (title, abstract, content)
                         against ('${query}' in natural language mode) limit ${limit} offset ${offset}`)
    },

    //tải các bài viết xem nhiều nhất trong tuần
    theMostViewdInWeek: (isPremium,limit) => {
        var premium = ''

        if (isPremium) {
            premium = 'n.type desc, '
        }

        var query = `select n.*, c.name, n.nid, count(distinct cm.cmid) as total_cmt
                        from news n
                                left join category c on n.category = c.cid
                                left join comment cm on cm.nid = n.nid
                        where yearweek(n.created_date) = yearweek(curdate()) and n.status = 'published'
                        group by n.nid
                        order by ${premium} n.created_date desc
                        limit ${limit}`

        return db.load(query)
    },

    //tải các bài viết nhiều lượt xem nhất trong tất cả các chuyên mục
    theMostViewedInAllCate: (isPremium,limit) => {
        var premium = ''

        if (isPremium) {
            premium = 'n.type desc, '
        }

        var query = `select n.*, n.nid, count(distinct cm.cmid) as total_cmt
                    from news n
                            left join comment cm on cm.nid = n.nid
                    where n.status = 'published'
                    group by n.nid
                    order by ${premium} n.views desc
                    limit ${limit}`

        return db.load(query);
    },

    //tải các bài viết mới nhất trong tất cả các chuyên mục
    theNewestInAllCate: (isPremium,limit) => {
        var premium = ''

        if (isPremium) {
            premium = 'n.type desc, '
        }

        var query = `select n.*, n.nid, count(distinct cm.cmid) as total_cmt
                    from news n
                            left join comment cm on cm.nid = n.nid
                    where n.status = 'published'
                    group by n.nid
                    order by ${premium} created_date desc limit ${limit}`

        return db.load(query)
    },

    //tải các bài viết đươc xem nhiều nhất trong từng chuyên mục
    theMostViewedCate: limit => {
        return db.load(`select N.*, N.nid, C.name, count(distinct cm.cmid) as total_cmt 
                        from news as N 
                                left join (select * from (select c.cid, c.name, max(n.views) as views
                                                            from category c left join news n on c.cid = n.category 
                                                            group by c.cid
                                                            order by views desc limit ${limit}) as V 
                                                        left join (select category, max(created_date) as maxdate
                                                                    from news 
                                                                    group by news.category) as D 
                                                        on D.category = V.cid) as C 
                                on N.category = C.cid
                                left join comment cm on cm.nid = N.nid
                        where N.created_date = C.maxdate and N.status = 'published'  and N.type != 'premium'
                        group by N.nid`)
    },

    theMostViewedCateWithPremium: limit => {
        return db.load(`select * from(select N.*, C.name, count(distinct cm.cmid) as total_cmt 
                                from news as N 
                                        left join (select * from (select c.cid, c.name, max(n.views) as views
                                                                    from category c left join news n on c.cid = n.category 
                                                                    group by c.cid
                                                                    order by views desc limit ${limit}) as V 
                                                                left join (select category, max(created_date) as maxdate
                                                                            from news ns
                                                                            group by ns.category) as D 
                                                                on D.category = V.cid) as C 
                                        on N.category = C.cid
                                        left join comment cm on cm.nid = N.nid
                                where N.created_date = C.maxdate and N.status = 'published'
                                group by N.nid) as t
                        order by t.type desc`)
    },

    //tải các bài viết premium mới nhất
    loadPremiumRecentNews: limit => {
        return db.load(`select * from news where type = 'premium' order by created_date desc limit ${limit}`)
    },

    search: (query, offset, limit) => {
        return db.load(`SELECT n.*, c.name, count(distinct cm.cmid) as total_cmt
                        FROM news n
                                left join category c on n.category = c.cid 
                                left join comment cm on cm.nid = n.nid
                        WHERE MATCH (n.title,n.abstract,n.content) 
                        AGAINST ('${query}' IN NATURAL LANGUAGE MODE) AND n.status ='published'AND n.type != 'premium'
                        GROUP BY n.nid
                        LIMIT ${offset}, ${limit}`)
    },

    searchWithPremium: (query, offset, limit) => {
        return db.load(`SELECT * FROM(SELECT n.*, c.name, count(distinct cm.cmid) as total_cmt
                                        FROM news n
                                                left join category c on n.category = c.cid 
                                                left join comment cm on cm.nid = n.nid
                                        WHERE MATCH (n.title,n.abstract,n.content) 
                                        AGAINST ('${query}' IN NATURAL LANGUAGE MODE) and n.status ='published'
                                        group by n.nid
                                        limit ${offset}, ${limit}) as t
                                order by t.type desc`)
    },

    single: id => {
        return db.load(`select * from news where nid = ${id}`);
    },
    
    add: entity => {
        return db.add('news', entity);
    },

    update: entity => {
        return db.update('news', 'nid', entity);
    },

    delete: id => {
        return db.delete('news', 'nid', id);
    }
}