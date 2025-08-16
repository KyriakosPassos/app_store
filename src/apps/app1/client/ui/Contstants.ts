export const allowedPaths = {
  Blocked: ["In Specification", "To Do", "In Progress"],
  "In Specification": ["Blocked", "To Do"],
  "To Do": ["Blocked", "In Specification", "In Progress"],
  "In Progress": ["Blocked", "In Specification", "To Do", "In Review"],
  "In Review": ["In Specification", "In Progress", "Done"],
  Done: [],
} as const;

export type ColumnTitle = keyof typeof allowedPaths;
