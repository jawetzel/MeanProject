module.exports = function (router, db){
    router.route('/login').post((req, res, next) => {
        db.UserCrud.login(req.body, result => {
            res.send(result);
        });
    });
};