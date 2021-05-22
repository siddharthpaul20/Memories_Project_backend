import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch(error) {
        res.status(404).json({ message: error.message });   
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch(error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    try {
        if(!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post with that id");

        const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
        res.status(201).json(updatedPost);
    } catch (error)
    {
        console.log(error);
        return res.status(404).send("No post with that id");
    }
    
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send("No post with that id");
        await PostMessage.findByIdAndRemove(id);
        res.json({ message: "Post deleted successfully."});
    } catch(error) {
        console.log(error);
        return res.status(404).send("No post with that id");
    }
}


export const likePost = async (req, res) => {
    const { id } = req.params;
    try {

        // first checking after applying middleware if the user is valid or not
        if(!req.userId)
            return res.json({ message: "Unauthenticated." });

        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send("No post with that id");

        const post = await PostMessage.findById(id);
        // after getting the post, now inside like's list of the post, we iterate to check if the userId is already present or not
        // and get a index

        const index = post.likes.findIndex((id) => id === String(req.userId));
        console.log(index);
        if(index===-1)
        {
            //likes a post
            post.likes.push(req.userId);
        }
        else
        {
            //dislikes a post
            post.likes = post.likes.filter((id) => id !== String(req.userId));
            // filter is gonna return as array of id except the current user id
        }
        // now we have the likes in the likes of the post, we now gonna made a simple update request to update the post with this object

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post , { new: true });
        
        res.json(updatedPost);
    } catch(error) {
        console.log(error);
        return res.status(404).send("No post with that id");
    }
}
