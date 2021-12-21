const express = require('express');
const passport = require('passport');
const passport_config = require('../passport_config');
const userRouter = express.Router();
const User = require('../models/user_schema');
const bcrypt = require('bcryptjs');

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

module.exports = userRouter;