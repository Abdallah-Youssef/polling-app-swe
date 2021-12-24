const express = require('express');
const pollRouter = express.Router();
const Poll = require('../models/poll_schema');
const Vote = require('../models/vote_schema');
const poll_helpers = require('../helpers/poll_helpers');


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

/* Should we allow creators to delete their polls to begin with?
pollRouter.delete('/deletePost', async (req, res) => {
    try
    {
        const postToBeDeleted = await Post.findById(req.body.id);
        console.log(postToBeDeleted);
        console.log("server " + req.user.id);
        if(req.user.id != postToBeDeleted.postedBy)
            return res.send('User not authorized to delete post');
        //delete comments
        await Comment.deleteMany({postId: req.body.id});
        await postToBeDeleted.deleteOne();
        return res.json({status: 'delete'});
    }catch(error)
    {
        console.log('Error in delete post: ' + error);
        return res.json({status: 'error'});
    }
});
*/


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
        /// ?????????????????????????????
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



pollRouter.get('/:pollId', async (req, res) => { 
    let userId = req.user.id
    var poll = await Poll.findById(req.params.pollId)
    
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
    res.send(newPoll);
})


  

module.exports = pollRouter;
