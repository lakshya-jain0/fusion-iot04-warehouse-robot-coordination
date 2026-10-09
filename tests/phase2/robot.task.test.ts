import { describe, expect, it } from 'vitest';
import type { Robot, RobotStatus } from '../../src/robot.js';
import type { Task } from '../../src/task.js';

describe('Robot/task models', () => {
  it('constructs a robot with valid status', () => {
    const r: Robot = { robotId: 'r1', position: { row: 0, column: 0 }, status: 'IDLE', priority: 1 };
    expect(r.status).toBe('IDLE');
    expect(r.robotId).toBe('r1');
  });

  it('accepts MOVING with goal', () => {
    const r: Robot = { robotId: 'r1', position: { row: 2, column: 3 }, status: 'MOVING', priority: 2, taskId: 't1', goal: { row: 4, column: 4 } };
    expect(r.status).toBe('MOVING');
  });

  it('builds a task with goal and priority', () => {
    const t: Task = { taskId: 't1', goal: { row: 1, column: 1 }, priority: 5, completed: false, failed: false };
    expect(t.priority).toBe(5);
    expect(t.completed).toBe(false);
  });

  it('allows task assignment and completion state change', () => {
    const t: Task = { taskId: 't2', goal: { row: 10, column: 10 }, priority: 1, assignedRobotId: 'r1', completed: false, failed: false };
    expect(t.assignedRobotId).toBe('r1');
  });
});
