const express = require('express');
const pollRouter = express.Router();
const Poll = require('../models/poll_schema');

pollRouter.post('/createPoll', async (req, res)=>{
    try
    {
        // const postData = {
        //     postedBy: req.user.id,
        //     createdAt: new Date().getTime(),
        //     text: req.body.text
        // };
        // if(req.body.photoURL)
        //     postData.photoURL = req.body.photoURL;
        // const newPost = new Post(postData);
        // await newPost.save();
        return res.json({status: 'success'});
    }catch(error)
    {
        console.log('Error in send poll: ' + error);
        return res.json({status: 'error'});
    }
});



module.exports = pollRouter;