const express = require('express');
const pollRouter = express.Router();
const Poll = require('../models/poll_schema');
const Vote = require('../models/vote_schema');


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

/**
 * checks if the user issuing the request is the creator
 * or a voter
 */
async function isAuthorized(req, res, next){
    //console.log(req.params.pollId);
    const poll = await Poll.findById(req.params.pollId);
    const votes = await Vote.find({poll: poll.id});
    const voters = votes.map(v => v.user.toString());
    if (req.user.id == poll.postedBy.toString() 
        || voters.includes(req.user.id)){

            req.votes = votes;
            next();
    }
    else{
        return res.status('401').send();
    }
}


/**
 * Responds with the user's public and private polls 
 * if they are the one sending the request
 * or only the public ones if anybody else.
 * Response format: [{
 *      createdOn: Date
 *      question: string
 *      public: boolean
 *      choices: string[]  
 * }]
 */
pollRouter.get('/data/:userId', async (req, res) => {
    try
    {
        const polls = await Poll.find({postedBy: req.params.userId});
        const publisher = req.params.userId == req.user.id;
        const filtered = polls.filter((p) => publisher || p.public);
        return res.json({status: 'success', polls: filtered});
    }catch(error)
    {
        console.log('Error in get poll data: ' + error);
        return res.json({status: 'error'});
    }
});


/**
 * If the user is authorized to see the results (voter or creator)
 * it returns the results in the format
 * [{
 *      choice (string) : count (Number)
 * }]
 */
pollRouter.get('/results/:pollId', isAuthorized, async (req, res) => { 
    let userId = req.user.id
    var poll = await Poll.findById(req.params.pollId);
    //console.log(`\n\nRequesting the poll ${poll}`);
    
    const summary = await poll.getResultSummary(userId);
    //console.log(`Summary is ${JSON.stringify(summary)}`);

    res.send(summary);
})


  

module.exports = pollRouter;
