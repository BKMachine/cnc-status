import { initMachines } from '../../../machines';
import Machine, { MachineDoc } from './machine_model';

function list(): Promise<MachineDoc[]> {
  return Machine.find().sort('-1');
}

async function create(data: any): Promise<MachineDoc> {
  const doc = new Machine(data);
  return await doc.save();
}

async function update(id: string, data: any): Promise<MachineDoc | null> {
  const updated = await Machine.findByIdAndUpdate(id, data, { new: true });
  await initMachines();
  return updated;
}

async function remove(id: string): Promise<void> {
  await Machine.findByIdAndRemove(id);
  await initMachines();
}
export default {
  list,
  create,
  update,
  remove,
};
