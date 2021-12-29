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
    /*anonymous: { // do users vote anonymously? TODO
        type: Boolean,
        default: false
    },*/
    choices: {
        type: [String],
        validate: {
            validator: function(val){
                return val.length >= 2;
            },
            message: "Poll has less than 2 choices"
        }
    }/*,
    results:{ // store the results for fast retrieval and if we make the votes anonymous
        type: [Number],
        default: function(){
            const len = this.choices.length;
            let temp = [];
            for (let i = 0; i < len; i++)
                temp.push(0);
            return temp;
        }
    }*/
});


/**
 * If the user already voted, reject the vote
 * Else if the creator allowed anonymous votes, make the vote anonymous
 * Else associate the vote with the user
 */
PollSchema.static('submitVote', async function(voteData){
    /* const poll = await this.findById(voteData.poll)//.exec();

    if (voteData.choice >= poll.choices.length)
        throw new Error("Choice doesn't exit");
    if (voteData.choide < 0)
        throw new Error("Negative choice");*/

    const existingVote = await Vote.findOne({
        user: voteData.user, 
        poll: voteData.poll
    })// .exec();

    if (existingVote)
        throw new Error('This user has already voted in this poll');

    let saveVote = new Vote(voteData);
    
    /*if (poll.anonymous) {
        saveVote = new Vote({
            user: voteData.user,
            poll: voteData.poll
        });
    }
    else {
        saveVote = new Vote(voteData);
    }*/

    await saveVote.save();

    // TODO await poll.update({$inc : {'results.$[]' : 1}});
});


/**
 * change this user's vote
 */
PollSchema.static('changeVote', async function(newVoteData){
    // TODO anonymous
    await Vote.findOneAndUpdate({
        user: newVoteData.user,
        poll: newVoteData.poll
    }, {$set: {'choice' : newVoteData.choice}});
});


/**
 * Instance method, for this poll, summarize the results,
 * return {
 *      choices : [{
 *          text: string,
 *          count: Number
 *      }],
 *      voted: Number // the choice this user voted for, if available
 * }
 * 
 * It is an instance method because the endpoint already fetches the poll
 */
PollSchema.method('getResultSummary', async function(userId){
    // TODO anonymous

    const votes = await Vote.find({poll: this.id});
    let choices = new Array(this.choices.length);
    let voted = undefined;
    let ans = {};

    for(let i=0; i<choices.length; i++) {
        choices[i] = {};
        choices[i]['text'] = this.choices[i];
        choices[i]['count'] = 0;
    }

    votes.forEach((vote) => {
        choices[vote.choice].count++;
        console.log(vote.user + " - " + userId)
        if(vote.user == userId) {
            voted = vote.choice
        }
    });

    ans['choices'] = choices;
    ans['voted'] = voted;
    //console.log(`Summary is ${JSON.stringify(ans)}`);
    return ans;
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;