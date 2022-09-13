import { Router } from 'express';
import db from '../db/models/index.model.mjs';

// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import NFTController from '../controllers/nft.controller.mjs';

const router = Router();

const nftController = new NFTController(db);

router.get('/collection', nftController.getCollection);
router.get('/user', nftController.getHistory);

export default router;
