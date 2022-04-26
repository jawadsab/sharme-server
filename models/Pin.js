import mongoose from 'mongoose';

const pinSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pinImage: {
      type: String,
      required: true,
    },
    public_id: {
      type:String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    category: {
      type:String,
      required:true
    },
    saves: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }],
  },
  {
    timestamps: true,
  }
);

const pinModel = mongoose.model("Pin",pinSchema);
export default pinModel;
