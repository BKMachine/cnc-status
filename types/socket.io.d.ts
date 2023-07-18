interface ServerToClientEvents {
  refresh: () => void;
  change: (payload: { id: string; changes: Changes }) => void;
}
