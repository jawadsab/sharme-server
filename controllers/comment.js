import Comment from '../models/Comment.js';
import Pin from '../models/Pin.js';

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const postComment = async (req, res) => {
  try {
    const pinId = req.params.id;
    const { comment } = req.body;
    const pin = await Pin.findById(pinId);
    if (!pin) {
      return res
        .status(404)
        .json({ success: false, error: 'This pin does not exists' });
    }
    const newComment = new Comment({
      commentedBy: req.userID,
      comment,
      pin: pinId,
    });
    await newComment.save();
    pin.comments.push(newComment);
    await pin.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
