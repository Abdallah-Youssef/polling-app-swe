const express = require('express');
const passport = require('passport');
const passport_config = require('../passport_config');
const userRouter = express.Router();
const User = require('../models/user_schema');
const bcrypt = require('bcryptjs');
const Poll = require('../models/poll_schema');

userRouter.post('/changePassword', async (req, res) => {
    try
    {
        const {oldPassword, newPassword, confirmPassword} = req.body;
        const user = req.user;

        if(user.login_method !== 'local')
            return res.send('fail');
        const isMatch = await user.validatePassword(oldPassword);
        if(isMatch)
        {
            if(newPassword === confirmPassword)
            {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newPassword, salt);    
                await User.findByIdAndUpdate(user.id, {$set: {'local.password': hash}});
                return res.send('update successful');
            }
            return res.send('passwords dont match');
        }
        res.send('enter password correctly');
    }catch(error)
    {
        res.send(error);
        //res.send('an error occured');
    }
});

userRouter.post('/updateDisplayName', async (req, res) => {
    try
    {
        const user = req.user;
        await User.findByIdAndUpdate(user.id, {$set: {display_name: req.body.display_name}});
        res.send('display_name updated successfully to ' + req.body.display_name);
    }catch(error)
    {
        res.send('an error occured');
    }
});

/**
 * @api {get} /user/polls Get all user polls
 * @apiName GetUserPolls
 * @apiGroup User
 *
 * @apiQuery {String} userId Id of user
 * 
 * @apiSuccess {Poll[]} Body User's polls
 * @apiSuccess {String} postedBy Author info
 * @apiSuccess {String} postedBy._id  User id of the author
 * @apiSuccess {String} postedBy.local 
 * @apiSuccess {String} postedBy.local.email  Email of the author
 * 
 * 
 * @apiParamExample Request-Example:
 * user/polls?userId=61c212e078743f401426e042
 */
userRouter.get('/polls', async (req, res) => {
    let id = req.query.userId;
    const polls = await Poll.find({postedBy: id})
    .populate('postedBy',{_id:1, display_name: 1, 'local.email': 1});

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
 * 
 * @apiParamExample Request-Example:
 * user/61c212e078743f401426e042
 */
 userRouter.get('/:userId', async (req, res) => {
    let id = req.params.userId;
    const user = await User.findById(id);

    res.send({
        email: user.local.email,
        display_name: user.display_name
    })
});



module.exports = userRouter;