module.exports = function (router, db){
    router.use('/', function(req, res, next){
        //console.log(req.headers.session);
        //do admin check here, or permissiong, ect
        next();
    });

    router.post('/login', function(req, res, next){
        if(req.body && req.body.email && req.body.password){
            const invalids = validators.loginValidator(req.body);
            if(invalids.length > 0){
                res.send({error: true, reason: 'invalid fields', errors: invalids});
            } else {
                db.UserCrud.login({
                    data:{
                        email: req.body.email,
                        password: req.body.password
                    }
                }, function(response){
                    if(response.error){
                        res.send(response);
                    } else {
                        res.send('hi');
                    }
                });
            }
        } else {
            res.send({error: true, reason: 'missing fields, expected email and password'});
        }
    });
    router.post('/register', function(req, res, next){
        if(req.body && req.body.email && req.body.password){
            const invalids = validators.loginValidator(req.body);
            if(invalids.length > 0){
                res.send({error: true, reason: 'invalid fields', errors: invalids});
            } else {
                db.UserCrud.createUser({
                    data:{
                        email: req.body.email,
                        password: req.body.password
                    }
                }, function(response){
                    if(response.error){
                        res.send(response);
                    } else {
                        res.send({success: true});
                    }

                });
            }
        } else {
            res.send({error: true, reason: 'missing fields, expected email and password'});
        }
    });
};


const Validation = require('../Validator');

const validators = {
    loginValidator: function(body){
        const invalids = [];

        const emailInvalid = Validation(body.email, {req: true, email: true});
        if(emailInvalid.length > 0) invalids.push({field: 'email', reasons: invalids});

        const passwordInvalid = Validation(body.password, {req: true});
        if(passwordInvalid.length > 0) invalids.push({field: 'password', reasons: invalids});
        return invalids;
    }
};