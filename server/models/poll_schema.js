const mongoose = require('mongoose');
const {Schema} = mongoose;
const Vote = require('./vote_schema');

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
    closed: {
        type: Boolean,
        default: false
    },
    choices: {
        type: [String],
        validate: {
            validator: function(val){
                return val.length >= 2;
            },
            message: "Poll has less than 2 choices"
        }
    },
    photoID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'photos.files'
    }
});


/**
 * If the user already voted, reject the vote
 * Else if the creator allowed anonymous votes, make the vote anonymous
 * Else associate the vote with the user
 */
PollSchema.static('submitVote', async function(voteData){
    let saveVote = new Vote(voteData);
    await saveVote.save();
});


/**
 * change this user's vote
 */
PollSchema.static('changeVote', async function(newVoteData){
    // TODO anonymous
    const exiting_vote = await Vote.findOneAndUpdate({
                            user: newVoteData.user,
                            poll: newVoteData.poll
                        }, {$set: {'choice' : newVoteData.choice}});
    if (!exiting_vote)
        throw new Error("This user has not voted in this poll");
});


/**
 * Instance method, for this poll, summarize the results,
 * return {
 *      choices : [{
 *          text: string,
 *          count: Number
 *      }],
 * }
 * 
 * It is an instance method because the endpoint already fetches the poll
 */
PollSchema.method('getResultSummary', async function(){
    // TODO anonymous

    const poll = this;
    const votes = await Vote.find({poll: poll.id});
    let choices = new Array(poll.choices.length);
    let ans = {};

    for(let i=0; i<choices.length; i++) {
        choices[i] = {};
        choices[i]['text'] = poll.choices[i];
        choices[i]['count'] = 0;
    }

    votes.forEach((vote) => {
        choices[vote.choice].count++;
    });

    ans['choices'] = choices;
    //console.log(`Summary is ${JSON.stringify(ans)}`);
    return ans;
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;