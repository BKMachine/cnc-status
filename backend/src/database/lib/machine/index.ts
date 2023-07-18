import { initMachines } from '../../../machines';
import MachineModel from './machine_model';
import MachineService from './machine_service';

const machineEventEmitter = MachineModel.watch();

// Init machines if the machine database has changed
machineEventEmitter.on('change', async () => {
  await initMachines();
});

export default MachineService;
