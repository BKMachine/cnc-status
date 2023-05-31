interface ServerToClientEvents {
  refresh: () => void;
  change: (payload: { name: string; changes: { key: string; value: any }[] }) => void;
}
