const express = require('express');
const router = express.Router();
const passport = require('passport');
const passport_config = require('../passport_config')
const JWT = require('jsonwebtoken');
const User = require('../models/user_schema');
const bcrypt = require('bcryptjs');

function signToken(id)
{
    const userToken = JWT.sign({
        iss: "Meow",
        user_id: id/*,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getTime()+1)*/
    }, 'secret_gamEd_Awy');
    return userToken;
}

function sendTokenandUser(req, res) {
    const token = signToken(req.user.id);
    res.cookie("token", token, {
        maxAge: 86400000
    });

    console.log(req.user);

    let user = {
        id: req.user.id
    };

    if(req.user.login_method === 'facebook')
        user.email = req.user.facebook.email;

    res.status(200).json({
        user: user,
        token: token
    });
}

router.get('/', (req, res)=>{
    res.json('fdgdfg');
});

router.post('/signup', async (req, res, next)=>{

    const existingUser = await User.findOne({'local.email': req.body.email});

    if(existingUser)
        return res.status(400).json({error: 'user already exists!'});

        
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        login_method: 'local',
        local: {
            email: req.body.email,
            password: hash
        }
    });
    await newUser.save();
    req.user = newUser;
    next();
},sendTokenandUser);

router.post('/login', passport.authenticate('local', {session: false}), sendTokenandUser);

router.get('/oauth/facebook', passport.authenticate('facebook', {session: false, scope:['email']}));

router.get('/oauth/facebook/callback',passport.authenticate('facebook', {session: false, scope:['email']}),sendTokenandUser);


function debugReq(req, res, next)
{
    // console.log(req.headers);
    next();
}

router.get('/jsontoken', debugReq, passport.authenticate('jwt', {session: false}), sendTokenandUser);


module.exports = router;