var multer = require('multer');
var userModel = require('../models/user.model');

module.exports = function (app) {
    app.post('/upload-avatar', (req, res, next) => {
        var sess = req.session,
            UID = sess.UID;
        var path = "/images/avatar/" + UID.toString() + ".png";
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/images/avatar/');
            },
            filename: function (req, file, cb) {
                cb(null, UID.toString() + ".png");
            }
        })

        var upload = multer({storage});
        upload.array('image')(req, res, err => {
            if (err) {
                return res.json({
                    error: err.message
                });
            }
            else {
                var entity = {
                    UID: UID,
                    avatar: path
                }
                userModel.update(entity).then(function () {
                    res.json({});
                })
            }
        })
    })
    app.post('/company/upload-image', (req, res, next) => {
        var sess = req.session,
            CID = sess.CID;
        var path = "/images/company/" + CID.toString() + ".png";
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/images/company/');
            },
            filename: function (req, file, cb) {
                cb(null, CID.toString() + ".png");
            }
        })

        var upload = multer({storage});
        upload.array('image')(req, res, err => {
            if (err) {
                return res.json({
                    error: err.message
                });
            }
            else {
                var entity = {
                    CID: CID,
                    image: path
                }
                companyModel.update(entity).then(function () {
                    res.json({});
                })
            }
        })
    })
};