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
        min: [0, 'choice is negative'],
        validate: {
            validator: function (val){
                await this.populate('poll', 'choices');
                return val < this.poll.choices.length;
            },
            message: "choice doesn't exit"
        }
    },
    public: {type: Boolean, default: true}
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;