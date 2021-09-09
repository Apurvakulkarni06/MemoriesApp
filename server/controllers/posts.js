import mongoose from 'mongoose';
import PostMessage  from "../models/postMessage.js";

export const getPosts = async(req, res)=>{
    try{
        const postMessages = await PostMessage.find();
        console.log(postMessages)
        res.status(200).json(postMessages);

    }
    catch(error){
        console.log(error.message);
        res.status(404).json({message: error.message})
    }
    // res.send('THIS WORKS!')
};

export const createPost = async(req, res) =>{

    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString() });
    try{
        await newPost.save();

        res.status(201).json(newPost);
    }
    catch(error){
        res.status(409).json({message: error.message})
    }
    
}

export const updatePost = async (req, res) =>{
    const { id: _id } = req.params;
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) {
        console.log("post id not found")
        return res.status(404).send("No post found");
    }
    // post only contains parameters without id, that's why send { ...post, _id} to findByIdAndUpdate function
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true })
    console.log("updated post id", updatedPost._id)
    res.json(updatedPost)
}

export const deletePost = async (req, res) =>{
    const { id: _id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(_id))  return  res.status(404).send("post not found");

    await PostMessage.findByIdAndRemove(_id);
    res.json({"message":"Post deleted successfully"})

}

export const likePost = async (req, res) =>{

    const {id} = req.params;

    if(!req.userId) return res.status(404).json({message:"Unauthorized"})

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("post not found");
    
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id)=> id === String(req.userId))
    if(index === -1){
        // user liked the post
        post.likes.push(String(req.userId))
    }
    else{
        // user already liked the post now dislike it
        post.likes = post.likes.filter((id)=> id !== String(req.userId))
    }

    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new:true})
    
    res.status(200).json(updatedPost)
}