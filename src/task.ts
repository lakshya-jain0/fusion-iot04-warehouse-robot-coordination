import type { Coordinate } from './map/types.js';

export interface Task {
  readonly taskId: string;
  readonly goal: Readonly<{ row: number; column: number }>;
  readonly priority: number;
  assignedRobotId?: string;
  completed: boolean;
  failed: boolean;
}
