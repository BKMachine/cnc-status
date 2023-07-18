import { baseUrl } from '../config';
import { MachineDoc } from '../database/lib/machine/machine_model';
import { emit } from '../server/socket.io';

class Machine {
  private readonly doc: MachineDoc;
  private readonly logo: string;
  private readonly state: MachineState;

  constructor(doc: MachineDoc, state: MachineState) {
    this.doc = doc;
    this.logo = `${baseUrl}/img/machine_logos/${this.doc.brand}.png`;
    this.state = state;
  }

  getMachine() {
    return {
      id: this.doc._id,
      name: this.doc.name,
      serialNumber: this.doc.serialNumber,
      brand: this.doc.brand,
      source: this.doc.source,
      type: this.doc.type,
      paths: this.doc.paths,
      location: this.doc.location,
      logo: this.logo,
      state: this.state,
    };
  }

  getState() {
    return this.state;
  }

  setState(changes: Changes) {
    changes.forEach((change) => {
      const { key, value } = change;
      this.state[key as keyof MachineState] = value as never;
    });
    emit('change', { id: this.doc.id, changes });
  }
}

export default Machine;
