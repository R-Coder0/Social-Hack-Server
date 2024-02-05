import Post from "../models/Post.js";
import User from "../models/User.js"

// CREATE
// CREATE
export const createPost = async (req, res) => {
    try {
      const { userId, description, picturePath } = req.body;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        like: {},
        comments: [],
      });
  
      await newPost.save();
  
      const posts = await Post.find();
  
      res.status(201).json(posts); // Fix: Change `post` to `posts`
  
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

// READ

export const getFeedPost = async (req, res) => {
    try{
        const post = await Post.find();
        res.status(200).json(post);
    }catch(err) {
        res.status(404).json({message: err.message})
    }
}

export const getUserPosts = async (req, res) => {
    try{
        const { userId } = req.params; 
        const post = await Post.find({userId});
        res.status(200).json(post)
    }catch(err) {
        res.status(404).json({message: err.message})
    }
}

// UPADTE

export const likePost = async(req, res) => {
    try{
        const{id} = req.params;
        const{userId} = req.body;
        const post = await Post.findById(id);
        const isLiked  = post.likes.get(userId);
        
        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId, true);
        }

        const upadtePost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );

        res.status(200).json(upadtePost);
    }catch(err){
        res.status(404).json({message: err.message});
    }
}