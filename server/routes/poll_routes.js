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
pollRouter.post('/create', async (req, res)=>{
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
 * If the user is authorized to see the results (voter or creator)
 * it returns the results in the format
 *   {
 *      choices : [{
 *          text: string,
 *          count: Number
 *      }]
 *   }
 */
pollRouter.get('/results/:pollId', isAuthorized, async (req, res) => { 
    var poll = await Poll.findById(req.params.pollId);
    //console.log(`\n\nRequesting the poll ${poll}`);
    const summary = await poll.getResultSummary();
    //console.log(`Summary is ${JSON.stringify(summary)}`);

    res.send(summary);
});



/**
 * @api {get} /polls/:pollId Get poll data along with user's vote, if any
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
    const poll = await Poll.findById(req.params.pollId);
    await poll.populate('postedBy').execPopulate();
    const userId = req.user.id
    
    const author = poll.postedBy;
    
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
});



/**
 * Returns the choice this user has voted for if the poll is not anonymous
 * .. just a number
 */
pollRouter.get('/:pollId/vote/:userId', async (req, res) => {
    //TODO anonymous
    let vote = await Vote.find({user: req.params.userId, poll: req.params.pollId});
    res.send(vote.choice);
});
  

module.exports = pollRouter;
