import type { ParsedMap } from './map/types.js';
import type { Coordinate } from './map/types.js';
import type { Robot } from './robot.js';
import type { Task } from './task.js';
import { ReservationTable } from './reservationPlanner.js';

export interface SimulationOptions { horizon: number; }
export interface SimulationEvent { type: string; time: number; robotId?: string; taskId?: string; reason?: string; }
export interface SimulationMetrics { ticks: number; completedTasks: number; invalidMoves: number; vertexConflicts: number; edgeSwapConflicts: number; }

export class Simulation {
  readonly map: ParsedMap;
  readonly options: SimulationOptions;
  readonly robots: Robot[];
  readonly tasks: Task[];
  readonly reservations = new ReservationTable();
  readonly events: SimulationEvent[] = [];
  readonly metrics: SimulationMetrics = { ticks: 0, completedTasks: 0, invalidMoves: 0, vertexConflicts: 0, edgeSwapConflicts: 0 };

  constructor(map: ParsedMap, robots: Robot[], tasks: Task[], options: SimulationOptions) {
    if (!Number.isSafeInteger(options.horizon) || options.horizon <= 0) throw new Error('horizon must be positive');
    this.map = map; this.options = options; this.robots = robots; this.tasks = tasks;
  }
  tick(): void { this.metrics.ticks += 1; this.events.push({ type: 'tick', time: this.metrics.ticks }); }
}
