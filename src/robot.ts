import type { Coordinate } from './map/types.js';
import type { TimedPosition } from './planner.js';
export type RobotStatus = 'IDLE'|'MOVING'|'WAITING'|'COMPLETED'|'FAILED';
export interface Robot {
  readonly robotId: string;
  position: Coordinate;
  status: RobotStatus;
  priority: number;
  taskId?: string;
  goal?: Coordinate;
  path?: TimedPosition[];
  pathIndex?: number;
  planningError?: string;
}
