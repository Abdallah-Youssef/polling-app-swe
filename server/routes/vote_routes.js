const express = require('express');
const Vote = require('../models/vote_schema');
const voteRouter = express.Router();
const helper = requre('../helpers/vote_helpers.js')

/**
 * A user can submit a vote only once and cannot change it.
 * In the body, send the poll id, the choice and (optionally) 
 * whether the vote is public or private (default is public)
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

        await helper(voteData);
        return res.json({status: 'successVote'});
    }catch(error)
    {
        console.log('Error in vote: ' + error);
        return res.json({status: 'error'});
    }
});


module.exports = followRouter;