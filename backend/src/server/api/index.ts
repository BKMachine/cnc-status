import { Router } from 'express';
import machines from '../../machines';
import { emit } from '../socket.io';

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.get('/status', async (req, res, next) => {
  try {
    const response = [];
    let id = 0;
    for (const machine in machines) {
      const status = machines[machine as keyof typeof machines].getMachine();
      response.push({ ...status, index: id++ });
    }
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.get('/data/:name', (req, res, next) => {
  try {
    const { name } = req.params;
    const machine = machines[name as keyof typeof machines];
    if (!machine) {
      res.sendStatus(404);
      return;
    }
    const response = machine.getMachine();
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/refresh', (req, res, next) => {
  const { token } = req.body;
  if (!process.env.TOKEN || !token || token !== process.env.TOKEN) {
    res.sendStatus(401);
    return;
  }
  emit('refresh');
  res.sendStatus(204);
});

export default router;
