import { Router } from 'express';
import machines from '../../machines'

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.get('/status', async (req, res, next) => {
  try {
    const status = machines()
    res.status(200).json(status);
  } catch(e) {
    next(e)
  }
});

export default router;
