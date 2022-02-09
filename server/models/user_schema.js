const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const colorValidator = (v) => (/^#([0-9a-f]{3}){1,2}$/i).test(v)

const UserSchema = new Schema({
    display_name: {type: String},
    bio: {type: String, default:"Welcome to my profile!"},
    color:{type: String, default:"#ffffff", validate: [colorValidator, 'not a valid color']},
    login_method: {type: String, enum: ['local', 'facebook'], required: true},
    local: {
        email: {type: String, lowercase: true},
        password: {type: String}
    },
    facebook: {
        id: {type: String},
        email: {type: String, lowercase: true}
    },
    verified: {
        type: Boolean,
        default: true
    }
});
/*
UserSchema.pre('save', async function(next){
    try
    {
        console.log(this.local.password);
        next();
    }catch(err)
    {
        next(err);
    }
});
*/

UserSchema.methods.validatePassword = async function(newPassword){
    try
    {
        return await bcrypt.compare(newPassword, this.local.password);
    }catch(err)
    {
        console.log(err);
    }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;