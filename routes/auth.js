import express from 'express';
import { check } from 'express-validator';
import { register, login } from '../controllers/auth.js';

const router = express.Router();

router
  .route('/register')
  .post(
    [
      check('username', 'Please provide username with 3 or more chanracters')
        .not()
        .isEmpty()
        .isLength({ min: 3 }),
      check('email', 'Please provide valid email address')
        .not()
        .isEmpty()
        .isEmail(),
      check('password', 'Please provide password with minimum of 8 charachters')
        .not()
        .isEmpty()
        .isLength({ min: 8 }),
    ],
    register
  );
router
  .route('/login')
  .post(
    [
      check('email', 'Please provide valid email address')
        .not()
        .isEmpty()
        .isEmail(),
      check('password', 'Please provide password with minimum of 8 charachters')
        .not()
        .isEmpty(),
    ],
    login
  );


export default router;
