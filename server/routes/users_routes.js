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
        console.log(confirmPassword);
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
        console.log(req.body.display_name);
        await User.findByIdAndUpdate(user.id, {$set: {display_name: req.body.display_name}});
        res.send('display_name updated successfully to ' + req.body.display_name);
    }catch(error)
    {
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
 */
userRouter.get('/polls/:userId?', async (req, res) => {
    let requesting_user = req.user._id;
    let requested_user;
    if (req.params.userId)
        requested_user = req.params.userId;
    else
        requested_user = requesting_user;
        
    let filter = {postedBy: req.params.userId};

    if (requesting_user != requested_user){
        filter['public'] = true;
        console.log("The requester is not the creator");
    }
    //console.log(id)

    const polls = await Poll.find(filter);
    console.log(polls)
    res.send(polls.reverse())
});


module.exports = userRouter;