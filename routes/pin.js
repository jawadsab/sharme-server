import express from 'express';
import auth from '../middleware/auth.js';
import { multerUploads } from '../middleware/multer.js';
import {
  getAllPins,
  getPinById,
  getCommentsByPin,
  getPinsByCategory,
  searchPins,
  createPin,
  savePin,
  deletePin,
} from '../controllers/pin.js';

const router = express.Router();

router.route('/').get(getAllPins);
router.route('/:id').get(getPinById);
router.route('/:id/comments').get(getCommentsByPin);
router.route('/:cat/all').get(getPinsByCategory);
router.route('/search/:term').get(searchPins);
router.route('/').post(auth, multerUploads, createPin);
router.route('/:id').put(auth, savePin);
router.route('/:id').delete(auth, deletePin);

export default router;
