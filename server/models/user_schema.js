const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const UserSchema = new Schema({
    display_name: {type: String},
    login_method: {type: String, enum: ['local', 'facebook'], required: true},
    local: {
        email: {type: String, lowercase: true},
        password: {type: String}
    },
    facebook: {
        id: {type: String},
        email: {type: String, lowercase: true}
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