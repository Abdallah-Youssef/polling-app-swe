const mongoose = require('mongoose');
const {Schema} = mongoose;

const PollSchema = new Schema({
    postedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdOn: {
        required: true,
        type: Date
    },
    question: {
        required: true,
        type: String
    },
    public: {
        type: Boolean, 
        default: true
    },
    choices: [String]
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;