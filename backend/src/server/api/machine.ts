import express from 'express';
import MachineService from '../../database/lib/machine';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const newDoc = await MachineService.create(req.body);
    res.status(201).json(newDoc);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await MachineService.remove(req.params.id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedDoc = await MachineService.update(req.params.id, req.body);
    if (!updatedDoc) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(updatedDoc);
  } catch (e) {
    next(e);
  }
});

export default router;
