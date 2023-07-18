import Machine, { MachineDoc } from './machine_model';

function list(): Promise<MachineDoc[]> {
  return Machine.find().sort('-1');
}

async function create(data: any): Promise<void> {
  const doc = new Machine(data);
  await doc.save();
}

async function update(data: any): Promise<void> {
  await Machine.findByIdAndUpdate(data._id, data, { upsert: true });
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
