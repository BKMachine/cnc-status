interface Machine {
  name: string;
  status: import('@/plugins/enums').status;
  time: Date;
  lastCycle: number;
}
