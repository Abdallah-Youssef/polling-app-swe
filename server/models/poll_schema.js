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
    choices: {
        type: [String],
        validate: {
            validator: function(val){
                return val.length >= 2;
            },
            message: "Poll has less than 2 choices"
        }
    }
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;