import type { Coordinate } from './map/types.js';
import { getNeighbors, isTraversable } from './map/grid.js';

export interface Reservation {
  cell: Coordinate;
  time: number;
  robotId: string;
}

export interface EdgeReservation {
  from: Coordinate;
  to: Coordinate;
  time: number;
  robotId: string;
}

export class ReservationTable {
  private vertex = new Map<string, string>(); // "r,c,t" -> robotId
  private edge = new Map<string, string>();   // "r1,c1->r2,c2,t" -> robotId

  private keyCell(c: Coordinate, t: number): string {
    return `${c.row},${c.column},${t}`;
  }

  private keyEdge(from: Coordinate, to: Coordinate, t: number): string {
    return `${from.row},${from.column}->${to.row},${to.column},${t}`;
  }

  reserveVertex(c: Coordinate, t: number, robotId: string): void {
    this.vertex.set(this.keyCell(c, t), robotId);
  }

  releaseVertex(c: Coordinate, t: number): void {
    this.vertex.delete(this.keyCell(c, t));
  }

  isVertexReserved(c: Coordinate, t: number): boolean {
    return this.vertex.has(this.keyCell(c, t));
  }

  reserveEdge(from: Coordinate, to: Coordinate, t: number, robotId: string): void {
    this.edge.set(this.keyEdge(from, to, t), robotId);
  }

  releaseEdge(from: Coordinate, to: Coordinate, t: number): void {
    this.edge.delete(this.keyEdge(from, to, t));
  }

  isEdgeReserved(from: Coordinate, to: Coordinate, t: number): boolean {
    return this.edge.has(this.keyEdge(from, to, t));
  }

  getVertexRobot(c: Coordinate, t: number): string | undefined { return this.vertex.get(this.keyCell(c, t)); }
  reserveTimedPath(path: ReadonlyArray<{position: Coordinate; timeStep: number}>, robotId: string): void {
    for (let i=0; i<path.length; i++) { const state=path[i]; if (!state) continue; this.reserveVertex(state.position,state.timeStep,robotId); const prev=path[i-1]; if(prev) this.reserveEdge(prev.position,state.position,prev.timeStep,robotId); }
  }
  releaseFuture(robotId: string, fromTime: number): void {
    for (const [k,v] of this.vertex) if(v===robotId && Number(k.split(',').pop())>=fromTime)this.vertex.delete(k);
    for (const [k,v] of this.edge) if(v===robotId && Number(k.split(',').pop())>=fromTime)this.edge.delete(k);
  }
}

export interface PersistentOccupancy {
  cell: Coordinate;
  robotId: string;
}

export class PersistentOccupancyTable {
  private cells = new Map<string,string>();
  private key(c: Coordinate): string { return `${c.row},${c.column}`; }
  occupy(c: Coordinate, robotId: string): void { const k=this.key(c), owner=this.cells.get(k); if(owner&&owner!==robotId) throw new Error(`cell occupied by ${owner}`); this.cells.set(k,robotId); }
  release(c: Coordinate, robotId: string): void { if(this.cells.get(this.key(c))===robotId)this.cells.delete(this.key(c)); }
  isOccupied(c: Coordinate): boolean { return this.cells.has(this.key(c)); }
  isOccupiedByOther(c: Coordinate, robotId: string): boolean { const o=this.cells.get(this.key(c)); return o!==undefined&&o!==robotId; }
  getRobot(c: Coordinate): string|undefined { return this.cells.get(this.key(c)); }
}
