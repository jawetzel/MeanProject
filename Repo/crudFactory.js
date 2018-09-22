const bcrypt = require("bcrypt");
const uuidv1 = require('uuid/v1');

// forigens is an array of strings for use of including foreign table ref
const BaseCrud = function(table){
    return({
        get: function(callback, foreignFields = null) {
            const queery = table.find();
            if(foreignFields){
                foreignFields.map(function(foreignField){
                    queery.populate(foreignField);
                })
            }

            queery.exec(function(err, result){
                if(err){
                    callback({error: true, reason: 'error searching table'});
                } else if(!result){
                    callback({error: true, reason: 'failed to find items'});
                } else {
                    callback(result);
                }
            });
        },
        getPage: function(page, count, callback, foreignFields = null){
            const queery = table.find();
            if(foreignFields){
                foreignFields.map(function(foreignField){
                    queery.populate(foreignField);
                })
            }
            queery.skip((page - 1) * count).limit(count).exec(function(err, result){
                if(err){
                    callback({error: true, reason: 'error searching table'});
                } else if(!result){
                    callback({error: true, reason: 'failed to find items'});
                } else {
                    callback(result);
                }
            });
        },
        getByForeignKey: function(callback, field, id, foreignFields = null){
            const queery = table.find({[field]: id});
            if(foreignFields){
                foreignFields.map(function(foreignField){
                    queery.populate(foreignField);
                })
            }
            queery.exec(function(err, result){
                if(err){
                    callback({error: true, reason: 'error searching table'});
                } else if(!result){
                    callback({error: true, reason: 'failed to find items'});
                }  else {
                    callback(result);
                }
            });
        },
        getById: function(id, callback, foreignFields = null){
            const queery = table.findOne({_id: id});
            if(foreignFields){
                foreignFields.map(function(foreignField){
                    queery.populate(foreignField);
                })
            }
            queery.exec(function(err, result){
                if(err){
                    callback({error: true, reason: 'search error'});
                } else if(!result){
                    callback({error: true, reason: 'failed to find item'});
                }  else {
                    callback(result);
                }
            });
        },
        create: function(model, callback) {
            let newObject = new table(model);
            newObject.save(function(err, result){
                if(err){
                    callback({error: true, reason: 'error creating table item'});
                } else if(!result){
                    callback({error: true, reason: 'error creating table item'});
                }  else {
                    callback(result);
                }
            });
        },
        update: function(model, callback) {
            table.findOneAndUpdate({_id: model._id}, {$set: model}, function (err, result) {
                if(err){
                    callback({error: true, reason: 'error updating table item'});
                } else if(!result){
                    callback({error: true, reason: 'error updating table item'});
                } else {
                    callback(result);
                }
            });

        },
        delete: function(model, callback) {
            table.findOneAndDelete({_id: model.id}).exec((err, result) => {
                if(err){
                    callback({error: true, reason: 'error deleting table item'});
                } else if(!result){
                    callback({error: true, reason: 'error deleting table item'});
                } else {
                    callback(result);
                }
            });
        },
    });
};

const AccountCrud = function(userTable, sessionTable, roleTable){
    return({
        checkToken: function(model, callback){
            sessionTable.findOne({token: model.data.token}).populate('user').exec((err, result) => {
                if (err){
                    callback({error: true, reason: 'could not find session'});
                } else if(!result){
                    callback({error: true, reason: 'could not find session'});
                } else{
                    const expireDate = result.date.getTime() + 480*60000;
                    if(new Date().getTime() > expireDate){
                        callback({error: true, reason: 'session expired'});
                    } else {
                        callback(result);
                    }
                }
            })
        },
        login: function(model, callback) {
            userTable.findOne({ email: model.data.email }).exec((err, result) => {
                if (err){
                    callback({error: true, reason: 'could not find user'});
                } else if(!result){
                    callback({error: true, reason: 'could not find user'});
                } else {
                    bcrypt.compare(model.data.password, result.password, function (cryptErr, cryptResult){
                        if(cryptErr){
                            callback({error: true, reason: 'error comparing passwords'});
                        } else if(!cryptResult){
                            callback({error: true, reason: 'error comparing passwords'});
                        } else {
                            let session = new sessionTable({
                                token: uuidv1(),
                                date: new Date()
                            });
                            session.save(function(err, result){
                                if (err){
                                    callback({error: true, reason: 'error making token'});
                                } else if(!result){
                                    callback({error: true, reason: 'error making token'});
                                } else {
                                    callback({token: result.token, roles: result.roles});
                                }
                            });
                        }
                    });
                }
            });
        },
        createUser: function(model, callback) {
            userTable.findOne({ email: model.data.email }).exec((err, result) => {
                if(result){
                    callback({error: true, reason: 'email already taken'});
                } else {
                    let user = new userTable(model.data);
                    bcrypt.hash(user.password, 10, function(err, hash){
                        if(err){
                            callback({error: true, reason: 'hash error'});
                            console.log(err);
                        } else if(!hash){
                            callback({error: true, reason: 'hash error'});
                        } else {
                            user.password = hash;
                            user.save(function(err, result){
                                if (err) {
                                    callback({error: true, reason: 'failed to save'});
                                } else if (!result){
                                    callback({error: true, reason: 'failed to save'});
                                } else {
                                    callback(result);
                                }
                            });
                        }
                    });
                }
            });
        },
        addRole: function(userId, roleId, callback){
            userTable.findOne({_id: userId}).exec(function(userErr, user){
                if(userErr) {
                    callback({error: true, reason: 'error searching user'});
                } else if(!user){
                    callback({error: true, reason: 'user not found'});
                } else {
                    roleTable.findOne({_id: roleId}).exec(function (roleErr, role) {
                        if(roleErr) callback({success: false, reason: 'role not found'});
                        user.roles.push(role);
                        user.save(function(saveErr, saveUser){
                            if(saveErr){
                                callback({error: true, reason: 'updateUserError'});
                            } else if(!saveUser){
                                callback({error: true, reason: 'updateUserError'});
                            } else {
                                callback({success: true});
                            }
                        })
                    })
                }

            })
        },
        changePassword: function(user, callback){
            userTable.findOne({_id: user._id}).exec(function(userErr, foundUser){
                if(userErr){
                    callback({error: true, reason: 'Search user Error'});
                } else if(!foundUser){
                    callback({error: true, reason: 'Unable to find user'});
                } else {
                    bcrypt.hash(user.password, 10, function(errHash, hash){
                        if(errHash){
                            callback({error: true, reason: 'hash error'});
                        } else if(!hash){
                            callback({error: true, reason: 'hash error'});
                        } else {
                            foundUser.hash = hash;
                            foundUser.save(function(saveErr, saveResult){
                                if(saveErr){
                                    callback({error: true, reason: 'error saving user'});
                                } else {
                                    callback(saveResult);
                                }
                            });
                        }

                    });
                }

            })
        }
    });
};

module.exports = {
    BaseCrud: BaseCrud,
    AccountCrud: AccountCrud
};