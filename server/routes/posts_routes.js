/* const express = require('express');
const postRouter = express.Router();
const Post = require('../models/post_schema');
const Comment = require('../models/comment_schema');

postRouter.post('/sendPost', async (req, res)=>{
    try
    {
        const postData = {
            postedBy: req.user.id,
            createdAt: new Date().getTime(),
            text: req.body.text
        };
        if(req.body.photoURL)
            postData.photoURL = req.body.photoURL;
        const newPost = new Post(postData);
        await newPost.save();
        return res.json({status: 'success'});
    }catch(error)
    {
        console.log('Error in send post: ' + error);
        return res.json({status: 'error'});
    }
});

postRouter.delete('/deletePost', async (req, res) => {
    try
    {
        const postToBeDeleted = await Post.findById(req.body.id);
        console.log(postToBeDeleted);
        console.log("server " + req.user.id);
        if(req.user.id != postToBeDeleted.postedBy)
            return res.send('User not authorized to delete post');
        //delete comments
        await Comment.deleteMany({postId: req.body.id});
        await postToBeDeleted.deleteOne();
        return res.json({status: 'delete'});
    }catch(error)
    {
        console.log('Error in delete post: ' + error);
        return res.json({status: 'error'});
    }
});



postRouter.get('/getUserPosts', async (req, res) => {
    try
    {
        const posts = await Post.find({postedBy: req.body.id});
        console.log(posts);
        return res.json({status: 'success', posts: posts});
    }catch(error)
    {
        console.log('Error in delete post: ' + error);
        return res.json({status: 'error'});
    }
});


module.exports = postRouter; */