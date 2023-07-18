import { Document, Schema, model } from 'mongoose';

const schema = new Schema({
  name: String,
  serialNumber: String,
  brand: String,
  source: String,
  type: String,
  paths: Number,
  location: String,
});

export interface MachineDoc extends Document {
  name: string;
  serialNumber: string;
  brand: MachineBrand;
  source: MachineSource;
  type: MachineType;
  paths: 1 | 2;
  location: string;
}

export default model<MachineDoc>('machines', schema);
