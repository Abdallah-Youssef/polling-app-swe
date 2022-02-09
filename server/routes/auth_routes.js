const express = require('express');
const router = express.Router();
const passport = require('passport');
const passport_config = require('../passport_config')
const JWT = require('jsonwebtoken');
const User = require('../models/user_schema');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const config = require('config')
const VerificationLink = require('../models/verification_link_schema')
const crypto = require('crypto') // generates random string


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: config.get("mailUserName"),
        pass: config.get("mailPassword")
    },
});

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

    // console.log(req.user);

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


async function sendVerificationEmail(email, verificationLink){


    const message = `
    <b>Welcome to our website</b>
    Visit this link to verify your account : ${verificationLink}
    `
    if (process.env.NODE_ENV === 'test')
        return
        
    transporter.sendMail({
        from: `"Polling Website" <${config.get("mailUserName")}>`, // sender address
        to: email, // list of receivers
        subject: "Welcome to Polling Website - Verify Your Account", // Subject line
        html: message, // html body
      }).then(info => {
        console.log({info});
      }).catch(console.error);
}


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
        },
        verified: false
    });
    await newUser.save();
    req.user = newUser;


    const code =  crypto.randomBytes(64).toString('hex');

    const verificationLink = new VerificationLink({
        userId: newUser._id,
        code,
    });

    await verificationLink.save()
    sendVerificationEmail(req.body.email, "http://localhost:5000/verify/" + code)

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