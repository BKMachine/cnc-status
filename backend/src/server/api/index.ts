import { Router } from 'express';
import elastic from '../../elastic';
import machines from '../../machines';
import { emit } from '../socket.io';
import MachineRoutes from './machine';

const router = Router();

router.use('/machine', MachineRoutes);

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.get('/status', async (req, res, next) => {
  try {
    const response = [];
    let id = 0;
    for (const [, value] of machines) {
      const status = value.getMachine();
      response.push({ ...status, index: id++ });
    }
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.get('/status/:id', (req, res, next) => {
  try {
    const machine = machines.get(req.params.id);
    if (!machine) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(machine.getMachine());
  } catch (e) {
    next(e);
  }
});

router.get('/data/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!machines.has(id)) {
      res.sendStatus(404);
      return;
    }
    const { minutes } = req.query;
    const data = await elastic.getData(id, minutes);
    const response = data.hits?.hits?.map((x) => x._source);
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
