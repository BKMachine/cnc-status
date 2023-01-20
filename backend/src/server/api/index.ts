import { Router } from 'express';
import { getData } from '../../elastic';
import machines from '../../machines';
import { emit } from '../socket.io';

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

router.get('/status', async (req, res, next) => {
  try {
    const response = [];
    for (const machine in machines) {
      response.push({ ...machines[machine].getMachine(), id: machine });
    }
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.get('/status/:id', async (req, res, next) => {
  const id = req.params.id;
  if (!id || !machines[id]) {
    res.sendStatus(404);
    return;
  }
  try {
    res.status(200).json(machines[id].getMachine());
  } catch (e) {
    next(e);
  }
});

router.post('/refresh', (req, res, next) => {
  const { token } = req.body;
  if (token !== process.env.TOKEN) {
    res.sendStatus(401);
    return;
  }
  emit('refresh');
  res.sendStatus(204);
});

router.get('/data/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!id || !machines[id]) {
    res.sendStatus(404);
    return;
  }
  try {
    const response = await getData(id);
    const data = response.hits.hits.map((x) => x._source);
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
