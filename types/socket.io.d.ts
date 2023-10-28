interface ServerToClientEvents {
  refresh: () => void;
  change: (status: { id: string; changes: Changes }) => void;
}
