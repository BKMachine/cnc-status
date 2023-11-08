import { defineStore } from 'pinia';

const useMachineStore = defineStore('machine', {
  state: () => {
    return {
      machines: <MachineInfo[]>[],
    };
  },
  actions: {
    setMachines(statuses: MachineInfo[]) {
      this.machines = statuses;
    },
    updateMachineState(status: { id: string; changes: Changes }) {
      const { id, changes } = status;
      const index = this.machines.findIndex((x) => x.id === id);
      if (index !== -1) {
        const currentState = this.machines[index].state;
        this.machines[index].state = Object.assign({}, currentState, changes);
      }
    },
    addMachine(status: MachineInfo) {
      this.machines.push(status);
    },
    deleteMachine(index: number) {
      this.machines.splice(index, 1);
    },
    updateMachine(machine: { index: number; status: MachineInfo }) {
      const { index, status } = machine;
      this.machines[index] = Object.assign({}, this.machines[index], status);
    },
    updateMachineStatus(data: {id: string, status: MachineStatus}) {
      const { id, status } = data;
      const index = this.machines.findIndex((x) => x.id === id);
      if (index !== -1) {
        this.machines[index].status = status;
      }
    }
  },
});

export default useMachineStore;
