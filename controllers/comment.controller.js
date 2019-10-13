var commentModel = require('../models/comment.model')

module.exports = {
    getpageByNewsId: (req, res, callback) =>{
        var pram = req.params;
        commentModel.pageByNewsId(pram.nid, 5, 0).then((comments)=>{
            callback(comments);
        })
    },
    getcountByNewsId: (req, res , callback) =>{
        commentModel.pageByNewsId(req.params.nid).then((countComment)=>{
            callback(countComment);
        })
    },
    addComment: (req, res) =>{
        var entity = {
            content: req.body.message,
            uid: res.locals.authUser.uid,
            nid: req.params.nid
        }
        commentModel.add(entity).then(()=>{
            console.log(entity);
            res.redirect('/news/'+req.params.nid+'#comment-list')

        })
    }
}