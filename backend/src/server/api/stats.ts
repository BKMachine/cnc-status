import express from 'express';
import { getHourly } from '../../elastic/performance';

const router = express.Router();

router.get('/hourly', async (req, res, next) => {
  try {
    const response = await getHourly();
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

export default router;
