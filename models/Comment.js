import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comment: {
        type:String,
        required:true
    },
    pin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pin"
    }
},{timestamps:true});

const commentModel = mongoose.model("Comment",commentSchema);
export default commentModel;