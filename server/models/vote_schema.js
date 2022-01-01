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

/*VoteSchema.pre('save', function(){
    console.log(`saving vote ${this}..`)
});*/

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;