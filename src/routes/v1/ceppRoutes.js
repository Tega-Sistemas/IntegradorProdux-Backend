import express from 'express';
import ceppController from '../../controllers/ceppController.js';

const router = express.Router();

router.use('/', ceppController);

export default router;
