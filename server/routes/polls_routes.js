const express = require('express');
const pollRouter = express.Router();
const Poll = require('../models/poll_schema');
const Vote = require('../models/vote_schema');
const poll_helpers = require('../helpers/poll_helpers');

pollRouter.post('/createPoll', async (req, res)=>{
    try
    {
        const postData = {
            postedBy: req.user.id,
            createdAt: new Date().getTime(),
            text: req.body.text
        };
        if(req.body.photoURL)
            postData.photoURL = req.body.photoURL;
        const newPost = new Post(postData);
        await newPost.save();
        return res.json({status: 'success'});
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
    const voters = votes.map(v => v.user);
    if (req.user.id === poll.postedBy 
        || voters.includes(req.user.id)){

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

module.exports = postRouter;