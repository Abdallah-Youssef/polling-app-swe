const mongoose = require('mongoose');
const {Schema} = mongoose;

const VoteSchema = new Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    poll: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll'
    },
    choice: {
        required: true,
        type: Number,
        min: 0,
        validate: function (val){
            // this function should ensure that the index of the 
            // choice is within bounds
            // not sure if I should populate the poll here or
            // in the "vote" route..
        }
    },
    public: {type: Boolean, default: true}
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;