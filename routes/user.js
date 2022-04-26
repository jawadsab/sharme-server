import express from 'express';
import auth from '../middleware/auth.js';
import { multerUploads } from '../middleware/multer.js';
import { getUser, loadUser, updateProfileImage,getAllPinsByUser,getAllSavedPins } from '../controllers/user.js';

const router = express.Router();

router.route('/').get(auth, loadUser);
router.route('/:id').get(getUser);
router.route("/:id/pins").get(getAllPinsByUser);
router.route("/:id/saved/pins").get(getAllSavedPins);
router
  .route('/profile-image/upload')
  .put(auth, multerUploads, updateProfileImage);

export default router;
