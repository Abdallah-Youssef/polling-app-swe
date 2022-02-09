const express = require('express');
const passport = require('passport');
const passport_config = require('../passport_config');
const userRouter = express.Router();
const User = require('../models/user_schema');
const bcrypt = require('bcryptjs');
const Poll = require('../models/poll_schema');


userRouter.post('/changePassword', async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = req.user;

        if (user.login_method !== 'local')
            return res.send('fail');
        const isMatch = await user.validatePassword(oldPassword);
        if (isMatch) {
            if (newPassword === confirmPassword) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newPassword, salt);
                await User.findByIdAndUpdate(user.id, { $set: { 'local.password': hash } });
                return res.send('update successful');
            }
            return res.send('passwords dont match');
        }
        res.send('enter password correctly');
    } catch (error) {
        res.send(error);
        //res.send('an error occured');
    }
});

userRouter.post('/updateDisplayName', async (req, res) => {
    try {
        const user = req.user;
        await User.findByIdAndUpdate(user.id, { $set: { display_name: req.body.display_name } });
        res.send('display_name updated successfully to ' + req.body.display_name);
    } catch (error) {
        res.send('an error occured');
    }
});


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
 * 
 * @api {get} /user/polls/:userId? Get all public user polls if the requesting user is not the 
 * requested user, or all public and private polls if the same person
 * @apiName GetUserPolls
 * @apiGroup User
 *
 * @apiParameter {String} userId Id of user
 * 
 * @apiSuccess {Poll[]} Body User's polls
 * @apiSuccess {String} postedBy Author info
 * @apiSuccess {String} postedBy._id  User id of the author
 * @apiSuccess {String} postedBy.local 
 * @apiSuccess {String} postedBy.local.email  Email of the author
 * 
 * 
 * @apiParamExample Request-Example:
 * user/polls/61c212e078743f401426e042
 */
userRouter.get('/polls/:userId', async (req, res) => {
    let requesting_user = req.user._id;
    let requested_user;
    if (req.params.userId)
        requested_user = req.params.userId;
    else
        requested_user = requesting_user;

    let filter = { postedBy: requested_user };

    if (requesting_user != requested_user) {
        filter['public'] = true;
        console.log("The requester is not the creator");
    }
    //console.log(id)

    const polls = await Poll.find(filter)
        .populate('postedBy', { _id: 1, display_name: 1, 'local.email': 1 });;
    console.log(polls)
    res.send(polls.reverse())
});



/**
 * @api {get} /user/:userId Get user info
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParameter {String} userId Id of user
 * 
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} [display_name] User's display_name
 * @apiSuccess {String} [bio] User's bio
 * @apiSuccess {String} [color] User's profile color
 * @apiParamExample Request-Example:
 * user/61c212e078743f401426e042
 */
userRouter.get('/:userId', async (req, res) => {
    let id = req.params.userId;
    try{
        const user = await User.findById(id);
        res.send({
            email: user.local.email,
            display_name: user.display_name,
            bio: user.bio,
            color: user.color
        })
    }
    catch(err){
        res.send({error: "user not found"})
    }

 
});

/**
 * @api {post} /user/updateinfo Update user info
 * @apiName Update The requesting User's Info
 * @apiGroup User
 *
 * @apiBody [{String}] [display_name] Display name
 * @apiBody [{String}] [bio] User's bio
 * @apiBody [{String}] [color] User's profile color
 * 
 */
userRouter.post('/updateinfo', async (req, res) => {
    const allowedKeys = ["display_name", "bio", "color"]

    let id = req.user.id
    const user = await User.findById(id);

    allowedKeys.forEach(key => {
        if (req.body[key] && typeof req.body[key] === 'string')
            user[key] = req.body[key]
    })

    try {
        await user.save();
        res.send({
            email: user.local.email,
            display_name: user.display_name,
            bio: user.bio,
            color: user.color
        })
    } catch (e) {
        res.json({ error: "Invalid color value" })
    }
});


module.exports = userRouter;
