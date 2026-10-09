import { describe, expect, it } from 'vitest';
import { ReservationTable } from '../../src/reservationPlanner.js';

describe('ReservationTable', () => {
  it('reserves and releases vertex reservations', () => {
    const table = new ReservationTable();
    table.reserveVertex({ row: 1, column: 2 }, 3, 'r1');
    expect(table.isVertexReserved({ row: 1, column: 2 }, 3)).toBe(true);
    table.releaseVertex({ row: 1, column: 2 }, 3);
    expect(table.isVertexReserved({ row: 1, column: 2 }, 3)).toBe(false);
  });

  it('reserves and checks directed edges independently', () => {
    const table = new ReservationTable();
    table.reserveEdge({ row: 0, column: 0 }, { row: 0, column: 1 }, 1, 'r1');
    expect(table.isEdgeReserved({ row: 0, column: 0 }, { row: 0, column: 1 }, 1)).toBe(true);
    expect(table.isEdgeReserved({ row: 0, column: 1 }, { row: 0, column: 0 }, 1)).toBe(false);
  });

  it('detects reverse-edge swap conflict', () => {
    const table = new ReservationTable();
    table.reserveEdge({ row: 0, column: 0 }, { row: 0, column: 1 }, 2, 'rA');
    table.reserveEdge({ row: 0, column: 1 }, { row: 0, column: 0 }, 2, 'rB');
    expect(table.isEdgeReserved({ row: 0, column: 0 }, { row: 0, column: 1 }, 2)).toBe(true);
    expect(table.isEdgeReserved({ row: 0, column: 1 }, { row: 0, column: 0 }, 2)).toBe(true);
  });

  it('returns robotId for vertex reservation', () => {
    const table = new ReservationTable();
    table.reserveVertex({ row: 5, column: 5 }, 0, 'rX');
    expect(table.getVertexRobot({ row: 5, column: 5 }, 0)).toBe('rX');
    expect(table.getVertexRobot({ row: 5, column: 5 }, 1)).toBeUndefined();
  });

  it('does not confuse reservations at different times', () => {
    const table = new ReservationTable();
    table.reserveVertex({ row: 2, column: 2 }, 1, 'r1');
    expect(table.isVertexReserved({ row: 2, column: 2 }, 2)).toBe(false);
  });
});
