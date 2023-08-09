import { Document, Schema, model } from 'mongoose';

const schema = new Schema({
  name: String,
  serialNumber: String,
  brand: String,
  model: String,
  source: String,
  type: String,
  paths: String,
  location: { type: String, unique: true },
});

export interface MachineDoc extends Document {
  name: string;
  serialNumber: string;
  brand: MachineBrand;
  model: string;
  source: MachineSource;
  type: MachineType;
  paths: '1' | '2';
  location: string;
}

export default model<MachineDoc>('machines', schema);
