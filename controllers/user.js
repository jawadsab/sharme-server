import User from '../models/User.js';
import Pin from "../models/Pin.js"
import DatauriParser from 'datauri/parser.js';
import path from 'path';
import { cloudinary } from '../cloudinaryConfig.js';

export const loadUser = async (req, res) => {
  try {
    const id = req.userID;
    const user = await User.findById(id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID)
      .populate('savedPins')
      .select('-password');
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const parser = new DatauriParser();
    const file = parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;
    const uploadedResponse = await cloudinary.uploader.upload(file);
    const updatedUser = await User.findByIdAndUpdate(
      req.userID,
      {
        profileImage: uploadedResponse.secure_url,
        public_id: uploadedResponse.public_id,
      },
      { new: true }
    ).select('-password');
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


export const getAllPinsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const pins = await Pin.find({ postedBy: userId }).select("postedBy pinImage saves").populate(
      'postedBy',
      'username _id profileImage'
    );
    return res.status(200).json({success:true,pins});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllSavedPins = async (req, res) => {
  try {
    const userId = req.params.id;
    const savedPins = await Pin.find({ saves: userId }).select("postedBy pinImage saves").populate(
      'postedBy',
      '_id username profileImage'
    );
    return res.status(200).json({success:true,pins:savedPins});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
