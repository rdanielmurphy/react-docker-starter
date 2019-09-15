import { Router } from 'express';
import * as DataController from '../controllers/data.controller';
import * as Middleware from '../util/accessProtectionMiddleware';

const router = new Router();

router.use(Middleware.accessProtectionMiddleware);

// Get all Data
router.route('/data').get(DataController.getData);

export default router;
