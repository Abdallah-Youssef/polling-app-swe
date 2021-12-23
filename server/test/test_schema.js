const assert = require('assert')
const Poll = require('../models/poll_schema')
const User = require('../models/user_schema')
const Vote = require('../models/vote_schema')
const vote_helper = require('../helpers/vote_helpers')
const poll_helpers = require('../helpers/poll_helpers')

describe('stores an instance of everything', function(){

    it('correctly stores users', async function(){
        const user = new User({
            display_name: 'dummy_user', 
            login_method: 'local',
            local: {
                email: 'abc@abc.abc',
                password: 'abc'
            }
        });

        await user.save();
        assert(!user.isNew);
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
    let second_user;

    it('rejects duplicate votes', async function(){
        second_user = new User({
            display_name: 'yummy_user', 
            login_method: 'local',
            local: {
                email: 'efg@abc.abc',
                password: 'hi;k'
            }
        });
        await second_user.save();
    
        poll = await Poll.findOne({
            question: "what are you?"
        });

        const first_vote = {
            user: second_user.id,
            poll: poll.id,
            choice: 1
        };
        await assert.doesNotReject(vote_helper(first_vote));

        const second_vote = {
            user: second_user.id,
            poll: poll.id,
            choice: 0
        };        
        await assert.rejects(vote_helper(second_vote),{
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
        await vote_helper(private_vote);

        const votes = await Vote.find({poll: poll.id});

        const results = await poll_helpers.getResults(votes);

        const expected = [
            {choice: 0, voter: 'dummy_user'},
            {choice: 1, voter: 'yummy_user'},
            {choice: 1}
        ];

        assert.deepStrictEqual(results, expected);
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

        console.log(voters);
        console.log(second_user.id);

        assert(!voters.includes(fourth_user.id.toString()));
        assert(voters.includes(second_user.id.toString()));
    })

});
