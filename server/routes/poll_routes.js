const express = require('express');
const pollRouter = express.Router();
const Poll = require('../models/poll_schema');
const User = require('../models/user_schema')
const Vote = require('../models/vote_schema');
const { photoUpload } = require('../initDB');
const { downloadPhoto } = require('../utils');


const DEBUG_FUNC = (req, res, next) => {
    console.log(req.body);
    next();
};

async function checkEmailVerification(req, res, next){
  // Check if user is verified
    const user = await User.findOne({_id: req.user.id})
    console.log(user)
    if (!user.verified){
        return res.json({error: "Please Verify your email"})
    }
    next();
}

/**
 * Check that the requesting user is the author of the poll 
 */
async function verifyAuthor(req, res, next){
    const poll = await Poll.findById(req.params.pollId)

    if(!poll)
        return res.json({error: "Give us the right poll id you fucking idiot :)"})

    if (poll.postedBy != req.user.id)
        return res.json({error: "The requestor is not the author"})
    
    next();
}


/**
 * Request Format
 * {
 *     question: string
 *     public: boolean
 *     choices: string[]
 * }
 */
pollRouter.post('/create', checkEmailVerification, photoUpload.single('photo'), async (req, res)=>{
    try
    {
        const pollData = {
            postedBy: req.user.id,
            createdOn: new Date().getTime(),
            question: req.body.question,
            public: req.body.public,
            choices: req.body.choices.split(','),
        };

        if(req.file)
            pollData.photoID = req.file.id;

        console.log(pollData);

        const newPost = new Poll(pollData);
        await newPost.save();
        return res.json({status: 'success', id: newPost._id});
    }catch(error)
    {
        console.log('Error in send post: ' + error);
        return res.json({error: 'error'});
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
    const photo = await downloadPhoto(poll.photoID);
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
    newPoll['photo'] = photo;
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
    let vote = await Vote.find({user: req.params.userId, poll: req.params.pollId});
    res.send(vote.choice);
});

/**
 * Return the prefix sum of the votes
 * Requestor must be the author
 */
pollRouter.get('/:pollId/votes', verifyAuthor, async (req, res) =>{
    const poll = await Poll.findOne({_id: req.params.pollId})
    const votes = await Vote.find({poll: req.params.pollId})
    votes.sort((a, b) => a.updatedAt - b.updatedAt)


    // Create prefix sum array for each choice
    let prefixes = []
    let counters = []
    for (let i = 0;i < poll.choices.length;i++){
        prefixes.push([])
        counters.push(0)
    }

    for (let i = 0;i < votes.length;i++){
        const choice = votes[i].choice
        counters[choice]++
        prefixes[choice].push({x: votes[i].updatedAt.getTime(), y: counters[choice]})
    }


    res.json({
        series: prefixes.map((prefix, i) => ({name: poll.choices[i], data: prefix}))
    })
})
  

pollRouter.get('/:pollId/close', verifyAuthor, async (req, res) =>{
    let pollId = req.params.pollId;

    const exiting_vote = await Poll.findOneAndUpdate({
        _id: pollId
    }, {$set: {'closed' : true}});

    if (!exiting_vote)
        throw new Error("This user has not voted in this poll");

    res.end("poll closed")
})

module.exports = pollRouter;
