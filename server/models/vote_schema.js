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
        type: Number,
        min: [0, 'choice is negative'],
        validate: {
            validator: async function (val){
                //const poll = await Poll.findById(this.poll, 'choices')
                await this.populate('poll', 'choices').execPopulate();
                return val < this.poll.choices.length;
            },
            message: "choice doesn't exit"
        }
    },
    public: {type: Boolean, default: true}
});

VoteSchema.pre('save', async function(){
    const existingVote = await this.constructor.findOne({
        user: this.user, 
        poll: this.poll
    });

    if (existingVote)
        throw new Error('This user has already voted in this poll');
});

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;