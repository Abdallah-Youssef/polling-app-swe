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
            postedBy: user.id, //TODO test non-extant id
            createdOn: new Date(),
            question: "what are you?",
            choices: ['human', 'alien'] //TODO test less than 2 choices
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