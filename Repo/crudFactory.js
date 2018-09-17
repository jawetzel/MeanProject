var bcrypt = require("bcrypt");
const uuidv1 = require('uuid/v1');


const BaseCrud = function(table){
    return({
        get: function(callback) {
            table.find().exec(function(err, result){
                if (err) console.log(err);
                if (result) callback(result);
            })
        },
        getPage: function(page, count, callback){
            table.find().skip((page - 1) * count).limit(count).exec(function(err, result){
               if(err){
                   console.log(err);
                   callback(err);
               } else {
                   callback(result);
               }
            });
        },
        getById: function(id, callback){
            table.findOne({_id: id}, function(err, result){
                if(err){
                    console.log(err);
                    callback(err);
                } else {
                    callback(result);
                }
            });
        },
        create: function(model, callback) {
            let menuItem = new table(model);
            menuItem.save(function(err, result){
                if (err) console.log(err);
                if (result) callback(result);
            });
        },
        update: function(model, callback) {
            table.findOneAndUpdate({_id: model._id}, {$set: model}, function (err, result) {
                if (err) console.log(err);
                if (result) callback(result);
            });

        },
        delete: function(model, callback) {
            table.findOneAndDelete({_id: model.id}).exec((error, result) => {
                if (error) console.log(error);
                if (result) callback(result);
            });
        },
    })
};

const AccountCrud = function(userTable, sessionTable, roleTable){
    return({
        checkToken: function(model, callback){
            sessionTable.findOne({token: model.data.token}).populate('user').exec((err, result) => {
                if (err){
                    callback({Success: false});
                } else if(!result){
                    callback({Success: false});
                } else {
                    const expireDate = result.date.getTime() + 480*60000;
                    if(new Date().getTime() > expireDate){
                        callback({Success: false});
                    } else {
                        callback({Success: true, user: result});
                    }
                }
            })
        },
        login: function(model, callback) {
            userTable.findOne({ email: model.data.email }).exec((err, result) => {
                if (err){
                    callback(err);
                } else if(!result){
                    callback('no user found');
                }
                bcrypt.compare(model.data.password, result.password, function (err, result){
                    if (result === true) {
                        let session = new sessionTable({
                            token: uuidv1(),
                            date: new Date()
                        });
                        session.save(function(err, result){
                            if (err) callback('error making token');
                            if (result) callback({Success: true, token: result.token, roles: result.roles});
                        });
                    } else {
                        return callback('error comparing passwords');
                    }
                });
            });
        },
        createUser: function(model, callback) {
            let user = new userTable(model);
            bcrypt.hash(user.password, 10, function(err, hash){
                if(err){
                    callback(err);
                }
                else {
                    user.password = hash;
                    user.save(function(err, result){
                        if (err) callback(err);
                        if (result) callback(result);
                    });
                }
            });

        },
        addRole: function(userId, roleId, callback){
            userTable.findOne({_id: userId}).exec(function(userErr, user){
                if(userErr) callback({success: false, reason: 'user not found'});
                roleTable.findOne({_id: roleId}).exec(function (roleErr, role) {
                    if(roleErr) callback({success: false, reason: 'role not found'});
                    user.roles.push(role);
                    user.save(function(saveErr, saveUser){
                        if(saveErr){
                            callback({success: false, reason: 'updateUserError'});
                        } else {
                            callback({success: true});
                        }
                    })
                })
            })
        }
    });
};


module.exports = {
    BaseCrud: BaseCrud,
    AccountCrud: AccountCrud
};