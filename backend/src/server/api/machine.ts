import express from 'express';
import MachineService from '../../database/lib/machine';
import getMachines from '../../machines';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    await MachineService.create(req.body);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

export default router;

/*
router.get('/data/:name', (req, res, next) => {
  try {
    const { name } = req.params;
    const machines = getMachines();
    const machine = machines[name];
    if (!machine) {
      res.sendStatus(404);
      return;
    }
    const response = machine.getMachine();
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});*/
