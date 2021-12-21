const assert = require('assert')
const Poll = require('../models/poll_schema')
const User = require('../models/user_schema')
const Vote = require('../models/vote_schema')

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

        assert.rejects(poll.save(), {
            namse: 'ValidationError'
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
        assert.rejects(other_vote.save(), {name: 'ValidationError'});
    });

});