const assert = require('assert')
const Poll = require('../models/poll_schema')
const User = require('../models/user_schema')
const Vote = require('../models/vote_schema')


let dummy_user, tummy_user, yummy_user;

describe('stores an instance of everything', function(){

    it('correctly stores users', async function(){
        dummy_user = new User({
            display_name: 'dummy_user', 
            login_method: 'local',
            local: {
                email: 'abc@abc.abc',
                password: 'abc'
            }
        });

        await dummy_user.save();
        assert(!dummy_user.isNew);
    });


    it('correctly stores polls', async function(){
        const user = await User.findOne({
            display_name: 'dummy_user'
        });

        const poll = new Poll({
            postedBy: user.id,
            createdOn: new Date(),
            question: "what are you?",
            choices: ['human', 'alien']
        });

        await poll.save();
        assert(!poll.isNew);
    });

    it('correctly stores votes', async function(){
        const user = await User.findOne({
            display_name: 'dummy_user'
        });

        const poll = await Poll.findOne({
            question: "what are you?"
        });

        const vote = new Vote({
            user: user.id,
            poll: poll.id,
            choice: 0
        });

        await vote.save();
        assert(!vote.isNew);
    });

});

describe('basic validation', function(){

    it('rejects less than 2 choices', async function(){
        const user = await User.findOne({
            display_name: 'dummy_user'
        });

        const poll = new Poll({
            postedBy: user.id,
            createdOn: new Date(),
            question: "are you sure?",
            choices: ['no']
        });

        await assert.rejects(poll.save(), {
            name: 'ValidationError'
        });
    });

    it('rejects out of bounds choices', async function(){
        const user = await User.findOne({
            display_name: 'dummy_user'
        });

        const poll = await Poll.findOne({
            question: "what are you?"
        });

        const vote = new Vote({
            user: user.id,
            poll: poll.id,
            choice: 10
        });
        assert.rejects(vote.save(), {
            name: 'ValidationError',
            message: "choice doesn't exit"
        });

        const other_vote = new Vote({
            user: user.id,
            poll: poll.id,
            choice: -1
        });
        await assert.rejects(other_vote.save(), {name: 'ValidationError'});
    });

});

describe('handles votes correctly', function(){

    let poll;

    it('rejects duplicate votes', async function(){
        yummy_user = new User({
            display_name: 'yummy_user', 
            login_method: 'local',
            local: {
                email: 'efg@abc.abc',
                password: 'hi;k'
            }
        });
        await yummy_user.save();
    
        poll = await Poll.findOne({
            question: "what are you?"
        });

        const first_vote = {
            user: yummy_user.id,
            poll: poll.id,
            choice: 1
        };
        await assert.doesNotReject(Poll.submitVote(first_vote));

        const second_vote = {
            user: yummy_user.id,
            poll: poll.id,
            choice: 0
        };        
        await assert.rejects(Poll.submitVote(second_vote),{
            name: 'Error',
            message: 'This user has already voted in this poll'
        });
    });

    it('counts votes correctly', async function(){
        const third_user = new User({
            display_name: 'tummy_user', 
            login_method: 'local',
            local: {
                email: 'kjfajs@abc.abc',
                password: 'ifs'
            }
        });
        await third_user.save();

        const private_vote = {
            user: third_user.id,
            poll: poll.id,
            choice: 1,
            public: false
        };
        await Poll.submitVote(private_vote);

        const results = await poll.getResultSummary();

        /*const expected = [
            {choice: 0, voter: 'dummy_user'},
            {choice: 1, voter: 'yummy_user'},
            {choice: 1}
        ];

        assert.deepStrictEqual(results, expected);*/

        assert.equal(results.choices[0].count, 1);
        assert.equal(results.choices[1].count, 2);
    });

    
    it('excludes non-voters correctly', async function(){
        let fourth_user  = new User({
            display_name: 'nummy_user', 
            login_method: 'local',
            local: {
                email: 'lsjf@abc.abc',
                password: 'hi;k'
            }
        });
        await fourth_user.save();

        const votes = await Vote.find({poll: poll.id});
        const voters = votes.map(v => v.user.toString());

        //console.log(voters);
        //console.log(second_user.id);

        assert(!voters.includes(fourth_user.id.toString()));
        assert(voters.includes(yummy_user.id.toString()));
    });

    it('changes votes correctly', async function(){
        const changed_vote = {
            user: yummy_user.id,
            poll: poll.id,
            choice: 0
        };

        await assert.doesNotReject(Poll.changeVote(changed_vote));

        const results = await poll.getResultSummary();

        assert.equal(results.choices[0].count, 2);
        assert.equal(results.choices[1].count, 1);
    });

});








