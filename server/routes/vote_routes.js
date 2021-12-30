const express = require('express');
const Poll = require('../models/poll_schema');
const voteRouter = express.Router();

/**
 * A user can submit a vote.
 * If the poll is not anonymous, the user can change the vote in another endpoint
 * In the body, send the poll id, the choice and (optionally) 
 * whether the vote is public or private (default is public)
 * format:
 * {
 *      poll: (string, poll ID),
 *      choice: (Number),
 *      public (boolean, optional)
 * }
 */
voteRouter.post('/submit', async (req, res)=>{
    try
    {

        const voteData = {
            user: req.user.id,
            poll: req.body.poll,
            choice: req.body.choice,
            public: req.body.public
        };


        if(!voteData.poll)
            throw new Error('Poll not found in request');

        await Poll.submitVote(voteData);
        return res.json({status: 'successVote'});
    }catch(error)
    {
        console.log('Error in submit vote: ' + error);
        return res.json({status: 'error'});
    }
});


/**
 * A user can submit a vote only once and cannot change it.
 * In the body, send the poll id, the choice and (optionally) 
 * whether the vote is public or private (default is public)
 * format:
 * {
 *      poll: (string, poll ID),
 *      choice: (Number),
 *      public (boolean, optional)
 * }
 */
 voteRouter.post('/change', async (req, res)=>{
    try
    {

        const voteData = {
            user: req.user.id,
            poll: req.body.poll,
            choice: req.body.choice,
            public: req.body.public
        };

        console.log(voteData)

        if(!voteData.poll)
            throw new Error('Poll not found in request');

        await Poll.changeVote(voteData);
        return res.json({status: 'successVote'});
    }catch(error)
    {
        console.log('Error in change vote: ' + error);
        return res.json({status: 'error'});
    }
});

module.exports = voteRouter;