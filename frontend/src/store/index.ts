import { createStore, Store, useStore as baseUseStore } from 'vuex';
import type { InjectionKey } from 'vue';

export interface State {
  machines: MachineStatus[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== 'production',
  state() {
    return {
      machines: [],
    };
  },
  mutations: {
    setMachines(state: State, payload: MachineStatus[]) {
      state.machines = payload;
    },
    updateMachineState(state: State, payload: { id: string; changes: any }) {
      const { id, changes } = payload;
      const machines = store.state.machines;
      const index = machines.findIndex((x) => x.id === id);
      if (index !== -1) {
        const currentState = machines[index].state;
        state.machines[index].state = Object.assign({}, currentState, changes);
      }
    },
    deleteMachine(state: State, index: number) {
      state.machines.splice(index, 1);
    },
    addMachine(state: State, payload: MachineStatus) {
      state.machines.push(payload);
    },
    updateMachine(state: State, payload: { index: number; data: MachineStatus }) {
      state.machines[payload.index] = Object.assign(
        {},
        state.machines[payload.index],
        payload.data,
      );
    },
  },
});
