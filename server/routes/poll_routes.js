const express = require('express');
const pollRouter = express.Router();
const Poll = require('../models/poll_schema');
const Vote = require('../models/vote_schema');
const poll_helpers = require('../helpers/poll_helpers');
const User = require('../models/user_schema');


/**
 * Request Format
 * {
 *     question: string
 *     public: boolean
 *     choices: string[]
 * }
 */
pollRouter.post('/createPoll', async (req, res)=>{
    try
    {
        const pollData = {
            postedBy: req.user.id,
            createdOn: new Date().getTime(),
            question: req.body.question,
            public: req.body.public,
            choices: req.body.choices
        };

        if(req.body.photoURL)
            pollData.photoURL = req.body.photoURL;
        const newPost = new Poll(pollData);
        await newPost.save();
        return res.json({status: 'success', id: newPost._id});
    }catch(error)
    {
        console.log('Error in send post: ' + error);
        return res.json({status: 'error'});
    }
});


async function isAuthorized(req, res, next){
    const poll = await Poll.findById(req.body.id);
    const votes = await Vote.find({poll: poll.id});
    const voters = votes.map(v => v.user.toString());
    if (req.user.id == poll.postedBy.toString() 
        || voters.includes(req.user.id.toString())){

            req.votes = votes;
            next();
    }
    else{
        return res.status('401').send();
    }
}

/** Checks if the user has voted or has created the poll
 * needs the poll id in the body
 * then returns an array {{choice, voter name (if the vote is public)}}
 */
pollRouter.get('/getPollResults', isAuthorized, async (req, res) => {
    try
    {
        const results = await poll_helpers.getResults(req.votes);
        console.log(results);
        return res.json({status: 'success', results: results});
    }catch(error)
    {
        console.log('Error in delete post: ' + error);
        return res.json({status: 'error'});
    }
});


/**
 * We need this path for private (and public) posts
 */
pollRouter.get('/getUserPolls', async (req, res) => {
    try
    {
        const polls = await Poll.find({postedBy: req.body.id});
        console.log(polls);
        return res.json({status: 'success', polls: polls});
    }catch(error)
    {
        console.log('Error in delete post: ' + error);
        return res.json({status: 'error'});
    }
});


/**
 * @api {get} /polls/:pollId Get poll data
 * @apiName GetPoll
 * @apiGroup Polls
 *
 * @apiParam {String} pollId 
 * @apiParamExample Request-Example:
 * polls/61cc3e0640db240f38f69a28
 * 
 * @apiSuccess {Poll} poll Poll Data
 * @apiSuccess {Object} author Info of author
 * @apiSuccess {String} author.email User email
 * @apiSuccess {String} [author.display_name] User's display name
 * @apiSuccess {String} author.id User id
 * 
 */
pollRouter.get('/:pollId', async (req, res) => { 
    const poll = await Poll.findById(req.params.pollId)
    const userId = req.user.id
    
    const authorId = poll.postedBy
    const author = await User.findById(authorId)
    
    const votes = await Vote.find({poll: req.params.pollId});
    let choices = new Array(poll.choices.length);
    let voted = undefined;

    for(let i=0; i<choices.length; i++) {
        choices[i] = {};
        choices[i]['text'] = poll.choices[i];
        choices[i]['count'] = 0;
    }

    votes.forEach((vote) => {
        choices[vote.choice].count++;
        console.log(vote.user + " - " + userId)
        if(vote.user == userId) {
            voted = vote.choice
        }
    });

    let newPoll = JSON.parse(JSON.stringify(poll));
    newPoll['choices'] = choices;
    newPoll['voted'] = voted;
    res.send({
        poll:newPoll,
        author: {
            display_name: author.display_name,
            email: author.local.email,
            id: author._id
        }
    });
})


  

module.exports = pollRouter;
