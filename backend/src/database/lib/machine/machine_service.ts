import Machine, { MachineDoc } from './machine_model';

function list(): Promise<MachineDoc[]> {
  return Machine.find().sort('-1');
}

async function create(data: any): Promise<MachineDoc> {
  const doc = new Machine(data);
  return await doc.save();
}

async function update(id: string, data: any): Promise<MachineDoc | null> {
  return Machine.findByIdAndUpdate(id, data, { new: true });
}

async function remove(id: string): Promise<void> {
  await Machine.findByIdAndRemove(id);
}
export default {
  list,
  create,
  update,
  remove,
};
