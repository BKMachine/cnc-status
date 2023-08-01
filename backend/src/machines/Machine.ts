import { baseUrl } from '../config';
import { MachineDoc } from '../database/lib/machine/machine_model';
import { emit } from '../server/socket.io';

class Machine {
  private readonly doc: MachineDoc;
  private readonly logo: string;
  private state: MachineState;

  constructor(doc: MachineDoc, state: MachineState) {
    this.doc = doc;
    this.logo = `${baseUrl}/img/machine_logos/${this.doc.brand}.png`;
    this.state = state;
  }

  getMachine() {
    return {
      id: this.doc.id,
      name: this.doc.name,
      serialNumber: this.doc.serialNumber,
      brand: this.doc.brand,
      source: this.doc.source,
      model: this.doc.model,
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
    const changeObj = Object.fromEntries(changes);
    this.state = Object.assign({}, this.getState(), changeObj);
    // Remove cycle property before sending changes over websocket
    delete changeObj.cycle;
    if (Object.keys(changeObj).length === 0) return;
    emit('change', { id: this.doc.id, changes: changeObj });
  }
}

export default Machine;
