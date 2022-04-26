import Pin from '../models/Pin.js';
import Comment from '../models/Comment.js';
import path from 'path';
import DatauriParser from 'datauri/parser.js';
import { cloudinary } from '../cloudinaryConfig.js';

export const getAllPins = async (req, res) => {
  try {
    const pins = await Pin.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'username profileImage');
    return res.status(200).json({ success: true, pins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getPinById = async (req, res) => {
  try {
    const pinId = req.params.id;
    const pin = await Pin.findById(pinId).populate('postedBy', 'username profileImage');
    return res.status(200).json({ success: true, pin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getCommentsByPin = async (req, res) => {
  try {
    const pinId = req.params.id;
    const comments = await Comment.find({ pin: pinId })
      .sort({ createdAt: -1 })
      .populate('commentedBy', 'username profileImage');
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getPinsByCategory = async (req, res) => {
  try {
    const category = req.params.cat;
    const pins = await Pin.find({ category })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'username profileImage');
    return res.status(200).json({ success: true, pins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const searchPins = async (req, res) => {
  try {
    const searchTerm = req.params.term;
    //  serach the term in title category description
    const pins = await Pin.find({
      $or: [
        { category: { $regex: searchTerm, $options: 'i' } },
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    });
    return res.status(200).json({ success: true, pins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createPin = async (req, res) => {
  try {
    let pinImage = '';
    let public_id = '';
    if (req.file) {
      const parser = new DatauriParser();
      const file = parser.format(
        path.extname(req.file.originalname).toString(),
        req.file.buffer
      ).content;
      const uploadedResponse = await cloudinary.uploader.upload(file);
      public_id = uploadedResponse.public_id;
      pinImage = uploadedResponse.secure_url;
    }
    const { title, description, category } = req.body;
    const newPin = new Pin({
      postedBy: req.userID,
      title,
      category,
      description,
      pinImage,
      public_id: public_id,
    });
    await newPin.save();
    return res.status(200).json({ success: true, pin: newPin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const savePin = async (req, res) => {
  try {
    const pinId = req.params.id;
    const pinToUpdate = await Pin.findOne({ _id: pinId });
    if (!pinToUpdate)
      return res
        .status(404)
        .json({ success: false, error: 'This pin does not exists' });
    const currentSaves = pinToUpdate.saves;
    const index = currentSaves.indexOf(req.userID);
    if (index > -1) {
      currentSaves.splice(index, 1);
    } else {
      currentSaves.push(req.userID);
    }
    pinToUpdate.saves = currentSaves;
    const pin = await pinToUpdate.save();
    return res.status(200).json({ success: true,pin:pinToUpdate });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePin = async (req, res) => {
  try {
    const pinId = req.params.id;
    const deletedPin = await Pin.findByIdAndDelete(pinId);
    if (!deletedPin)
      return res
        .status(404)
        .json({ success: false, error: 'This pin does not exists' });
    // delete image from cloudinary
    const public_id = deletedPin.public_id;
    await cloudinary.uploader.destroy(public_id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
