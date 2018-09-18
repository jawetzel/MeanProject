var mongoose = require("mongoose");

var CrudFactory = require('./crudFactory');
var Schemas = require('./Schemas');


var connString = process.env.connString || 'string';

mongoose.connect(connString, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', function() {
    console.log('db connected');
});


const User = mongoose.model('User', Schemas.UserSchema);
const Session = mongoose.model('Session', Schemas.SessionSchema);
const Role = mongoose.model('Role', Schemas.RoleSchema);

module.exports = {
    UserCrud: {...CrudFactory.BaseCrud(User), ...CrudFactory.AccountCrud(User, Session, Role)},
    SessionCrud: CrudFactory.BaseCrud(Session),
    RoleCrud: CrudFactory.BaseCrud(Role)
};