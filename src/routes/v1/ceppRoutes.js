import ceppController from '../../controllers/ceppController.js';

const router = express.Router();

router.use('/cepp', ceppController);

export default router;
