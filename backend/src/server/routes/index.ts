import { Router } from 'express';
import machines from '../../machines'

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.get('/status', async (req, res, next) => {
  try {
    const response = []
    for (const machine in machines) {
      const m = {...machines[machine]}
      delete m.mappings
      response.push(m)
    }
    res.status(200).json(response);
  } catch(e) {
    next(e)
  }
});

export default router;
