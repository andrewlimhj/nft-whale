/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-duplicates */
import { Router } from 'express';

import authMiddleware from '../middlewares/auth.middleware.mjs';

// eslint-disable-next-line import/no-named-as-default-member
import AuthController from '../controllers/auth.controller.mjs';

import {
  getMessageToSign,
  getJWT,
  reAuth,
} from '../controllers/web3Auth.controller.js';

const router = Router();

const authController = new AuthController();

router.post('/sign-in', authController.signIn);
router.get('/verify-sign-in', authMiddleware, authController.verifySignIn);
router.get('/sign-out', authController.signOut);

router.get('/', (req, res) => {
  res.send('Welcome to the Whale NFT server');
});

router.get('/message', getMessageToSign);
router.get('/jwt', getJWT);
router.get('/re-auth', reAuth);

export default router;
