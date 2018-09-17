var mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
    role: String
});

const UserSchema = mongoose.Schema({
    name: String,
    title: String,
    description: String,
    price: Number,
    roles: [RoleSchema]
});

const SessionSchema = mongoose.Schema({
    token: String,
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