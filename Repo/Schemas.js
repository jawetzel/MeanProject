var mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
    role: { type : String , unique : true },
});

const UserSchema = mongoose.Schema({
    email: { type : String , unique : true, required : true },
    password: { type : String , required : true },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }]
});

const SessionSchema = mongoose.Schema({
    token: { type : String },
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = {
    RoleSchema: RoleSchema,
    UserSchema: UserSchema,
    SessionSchema: SessionSchema
};