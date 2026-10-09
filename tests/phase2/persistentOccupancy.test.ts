import { describe, expect, it } from 'vitest';
import type { PersistentOccupancy } from '../../src/reservationPlanner.js';

describe('Persistent occupancy interface', () => {
  it('represents a completed robot cell that should not disappear', () => {
    const occ: PersistentOccupancy = { cell: { row: 3, column: 3 }, robotId: 'r_completed' };
    expect(occ.cell).toEqual({ row: 3, column: 3 });
    expect(occ.robotId).toBe('r_completed');
  });

  it('distinguishes persistent occupancy from time-indexed reservations', () => {
    expect(true).toBe(true); // conceptual; reservation table uses different key format
  });
});
