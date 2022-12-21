import { Router } from 'express';
import StatusService from '../services/status_service'

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.get('/status', async (req, res, next) => {
  try {
    const status = StatusService
    res.status(200).json(status);
  } catch(e) {
    next(e)
  }
});

export default router;
