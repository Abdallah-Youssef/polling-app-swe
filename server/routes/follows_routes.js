const express = require('express');
const Follow = require('../models/vote_schema');
const followRouter = express.Router();

followRouter.post('/toggle', async (req, res)=>{
    try
    {
        const followData = {
            user: req.user.id,
            target: req.body.target
        };

        if(!followData.target)
            return res.json({status: 'error'});

        const followPair = Follow.findOneAndDelete(followData);
        console.log(followPair);
        if(followPair) {
            return res.json({status: 'successDelete'});
        }
        
        const newFollow = new Follow(followData);
        await newFollow.save();
        return res.json({status: 'successAdd'});
    }catch(error)
    {
        console.log('Error in follow: ' + error);
        return res.json({status: 'error'});
    }
});


module.exports = followRouter;