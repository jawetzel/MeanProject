const bcrypt = require("bcrypt");
var faker = require('faker');

var AuthCheck = require('../utilities/AuthCheck');
const Validation = require('../utilities/InputValidation');
var Email = require('../utilities/Email');

const endpoints = [  //endpoints needing auth go here, others will be let through without check
    { method: 'GET', url: '/users', auth: ['Admin'] },
    { method: 'PUT', url: '/users', auth: ['Admin'] },
    { method: 'DELETE', url: '/users', auth: ['Admin'] },

    { method: 'POST', url: '/grantRole', auth: ['Admin'] },
    { method: 'POST', url: '/revokeRole', auth: ['Admin'] },

    { method: 'GET', url: '/roles', auth: ['Admin'] },
    { method: 'POST', url: '/roles', auth: ['Admin'] },
    { method: 'DELETE', url: '/roles', auth: ['Admin'] }
];

module.exports = function (router, db){
    router.use('/', function(req, res, next) {
        AuthCheck(endpoints, {req: req, res: res, next: next, db: db});
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
                        res.send(response);
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
    router.post('/lostPassword', function(req, res, next){
        if(req.body && req.body.email){
            const invalids = validators.lostPassword(req.body);
            if(invalids.length > 0){
                res.send({error: true, reason: 'invalid fields', errors: invalids});
            } else {
                db.UserCrud.getByFields({
                   email: req.body.email
                }, function(response){
                    if(response.error){
                        res.send(response);
                    } else {
                        const password = faker.random.word() + faker.random.word();
                        bcrypt.hash(password, 10, function(err, hash){
                            if(err){
                                res.send({error: true, reason: 'hash error'});
                            } else if(!hash){
                                res.send({error: true, reason: 'hash error'});
                            } else {
                                response[0].password = hash;
                                db.UserCrud.update(response[0], function(result){
                                    if (result.error) {
                                        res.send(result);
                                    } else {
                                        Email.sendEmail({
                                            emailTo: result.email,
                                            email: 'Password has been reset to: ' + password
                                        }, function(emailResult){
                                            res.send(emailResult);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } else {
            res.send({error: true, reason: 'missing fields, expected email and password'});
        }
    });
    router.post('/updatePassword', function(req, res, next){
        if(!req.headers.session){
            res.send({error: true, reason: 'no auth, only the user can update thier password'});
            return;
        }
        const sessionToken = req.headers.session;
        if(req.body && req.body.userId && req.body.newPassword && req.body.oldPassword){
            db.UserCrud.updatePassword(sessionToken, req.body.userId, req.body.newPassword, req.body.oldPassword, function(result){
               res.send(result);
            });
        }
    });

    router.get('/users', function(req, res, next){
        db.UserCrud.get(function(result){
            console.log(result);
        });
    });
    router.put('/users', function(req, res, next){
        if(req.body && req.body.id){
            db.UserCrud.getById(req.body.id, function(userResult){
                if(userResult.error){
                    res.send(userResult);
                    return;
                }
                if(req.body.email) userResult.email = req.body.email;
                //more fields here if add them, this is not for roles or password

                db.UserCrud.update(userResult, function(saveResult){
                    res.send(saveResult);
                });
            });
        } else {
            res.send({error: true, reason: 'missing fields, expected user Id'});
        }
    });
    router.delete('/users', function(req, res, next){
        if(req.body && req.body.id){
            db.UserCrud.delete({id: req.body.id}, function(result){
                res.send(result);
            })
        } else {
            res.send({error: true, reason: "expected id field"});
        }
    });

    router.post('/grantRole', function(req, res, next){
        console.log(req.body);
        if(req.body && req.body.userId && req.body.roleId){
            db.UserCrud.getById(req.body.userId, function(userResult){
                if(userResult.error){
                    res.send(userResult);
                    return;
                }
                db.RoleCrud.getById(req.body.roleId, function(roleResult){
                    if(roleResult.error){
                        res.send(roleResult);
                        return;
                    }
                    if(userResult.roles.filter(x => x._id === roleResult._id) > 0){
                        res.send({error: true, reason: 'user already has that role'});
                        return;
                    }
                    userResult.roles.push(roleResult._id);
                    db.UserCrud.update(userResult, function(saveResult){
                        res.send(saveResult)
                    });
                });
            }, 'roles');
        }
    });
    router.post('/revokeRole', function(req, res, next){
        console.log(req.body);
        if(req.body && req.body.userId && req.body.roleId){
            db.UserCrud.getById(req.body.userId, function(userResult){
                if(userResult.error){
                    res.send(userResult);
                    return;
                }
                db.RoleCrud.getById(req.body.roleId, function(roleResult){
                    if(roleResult.error){
                        res.send(roleResult);
                        return;
                    }
                    userResult.roles = userResult.roles.filter(x => x._id !== roleResult._id);
                    db.UserCrud.update(userResult, function(saveResult){
                        res.send(saveResult)
                    });
                });
            });
        }
    });

    router.get('/roles', function(req, res, next){
        db.RoleCrud.get(function(result){
            res.send(result);
        });

    });
    router.post('/roles', function(req, res, next){
        if(req.body && req.body.role){
            const invalids = validators.roleValidator(req.body);
            if(invalids.length > 0){
                res.send({error: true, reason: 'invalid fields', errors: invalids});
            } else {
                db.RoleCrud.create({role: req.body.role}, function(createResult){
                    res.send(createResult);
                });
            }
        } else {
            res.send({error: true, reason: "expected role field"});
        }
    });
    router.delete('/roles', function(req, res, next){
        if(req.body && req.body.id){
            db.RoleCrud.delete({id: req.body.id}, function(result){
                res.send(result);
            })
        } else {
            res.send({error: true, reason: "expected role field"});
        }
    });
};

const validators = {
    loginValidator: function(body){
        const invalids = [];

        const emailInvalid = Validation(body.email, {req: true, email: true});
        if(emailInvalid.length > 0) invalids.push({field: 'email', reasons: invalids});

        const passwordInvalid = Validation(body.password, {req: true});
        if(passwordInvalid.length > 0) invalids.push({field: 'password', reasons: invalids});
        return invalids;
    },
    lostPassword: function(body){
        const invalids = [];

        const emailInvalid = Validation(body.email, {req: true, email: true});
        if(emailInvalid.length > 0) invalids.push({field: 'email', reasons: invalids});
        return invalids;
    },
    roleValidator: function(body){
        const invalids = [];

        const emailInvalid = Validation(body.role, {req: true});
        if(emailInvalid.length > 0) invalids.push({field: 'email', reasons: invalids});

        return invalids;
    }
};
