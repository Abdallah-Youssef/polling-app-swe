const mongoose = require('mongoose');
const {Schema} = mongoose;

const VerificationLinkSchema = new Schema({
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    code: { // the random string
        required: true,
        type: "String"
    }
});

const VerificationLink = mongoose.model('VerificationLink', VerificationLinkSchema);

module.exports = VerificationLink;