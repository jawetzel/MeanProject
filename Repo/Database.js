var mongoose = require("mongoose");

var CrudFactory = require('./crudFactory');
var Schemas = require('./Schemas');


const User = mongoose.model('User', Schemas.UserSchema);
const Session = mongoose.model('Session', Schemas.SessionSchema);
const Role = mongoose.model('Role', Schemas.RoleSchema);


var connString = process.env.connString || 'string';


mongoose.connect(connString, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.once('open', function() {
    console.log('db connected');
    //seed database with default roles
    SeedRoles();
});


const SeedRoles = function(){
    Role.find().exec(function(err, result){
        if(result.filter(x => x.role === 'Admin').length === 0){
            let newObject = new Role({ role: 'Admin' });
            newObject.save(function(saveErr, saveResult){
                if(saveResult) console.log('created admin role');
            });
        }
    });
};


module.exports = {
    UserCrud: {...CrudFactory.BaseCrud(User), ...CrudFactory.AccountCrud(User, Session, Role)},
    SessionCrud: CrudFactory.BaseCrud(Session),
    RoleCrud: CrudFactory.BaseCrud(Role)
};

