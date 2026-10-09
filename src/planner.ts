import type { ParsedMap } from './map/types.js';
import type { Coordinate } from './map/types.js';
import { getNeighbors, isInBounds, isTraversable } from './map/grid.js';
import { ReservationTable, PersistentOccupancyTable } from './reservationPlanner.js';

export type TimedPosition = { position: Coordinate; timeStep: number };
export type PlannerResult =
 | { kind: 'path'; path: TimedPosition[] }
 | { kind: 'invalid'; reason: string }
 | { kind: 'no-route'; reason: 'NO_SAFE_ROUTE_WITHIN_HORIZON' | string };
export interface PlannerContext { map: ParsedMap; reservations: ReservationTable; occupancy: PersistentOccupancyTable; currentTime: number; horizon: number; robotId: string; }

type Node = TimedPosition & { g:number; h:number; f:number; parent?: Node };
const same=(a:Coordinate,b:Coordinate)=>a.row===b.row&&a.column===b.column;
const key=(c:Coordinate,t:number)=>`${c.row},${c.column},${t}`;
const edge=(a:Coordinate,b:Coordinate,t:number)=>`${a.row},${a.column}->${b.row},${b.column},${t}`;
const manhattan=(a:Coordinate,b:Coordinate)=>Math.abs(a.row-b.row)+Math.abs(a.column-b.column);

export function planTimedPath(start: Coordinate, goal: Coordinate, ctx: PlannerContext): PlannerResult {
 if (!Number.isSafeInteger(ctx.currentTime)||!Number.isSafeInteger(ctx.horizon)||ctx.horizon<=0) return {kind:'invalid',reason:'currentTime and horizon must be safe integers; horizon must be positive'};
 if (!isInBounds(ctx.map,start)||!isInBounds(ctx.map,goal)) return {kind:'invalid',reason:'endpoint out of bounds'};
 if (!isTraversable(ctx.map,start)||!isTraversable(ctx.map,goal)) return {kind:'invalid',reason:'endpoint blocked'};
 if (ctx.occupancy.isOccupiedByOther(start,ctx.robotId)) return {kind:'invalid',reason:'start persistently occupied'};
 const open: Node[] = [{position: start, timeStep: ctx.currentTime, g: 0, h: manhattan(start, goal), f: manhattan(start, goal)}];
 const closed=new Set<string>(); const best=new Map<string,number>(); best.set(key(start,ctx.currentTime),0);
 while(open.length){ open.sort((a,b)=>(a.g+a.h)-(b.g+b.h)||a.h-b.h||a.timeStep-b.timeStep||a.position.row-b.position.row||a.position.column-b.position.column); const n=open.shift()!; const nk=key(n.position,n.timeStep); if(closed.has(nk))continue; closed.add(nk);
  if(n.timeStep>=ctx.currentTime+ctx.horizon)continue;
  const next=[...getNeighbors(ctx.map,n.position),n.position];
  for(const p of next){const t=n.timeStep+1; const isWait=same(p,n.position); const owner=ctx.reservations.getVertexRobot(p,t); if(owner&&owner!==ctx.robotId)continue; if(ctx.occupancy.isOccupiedByOther(p,ctx.robotId)&&!(isWait&&same(p,n.position)))continue; if(!isWait&&ctx.reservations.isEdgeReserved(p,n.position,n.timeStep))continue; if(ctx.reservations.isEdgeReserved(n.position,p,n.timeStep))continue; const g=n.g+1; const k=key(p,t); if(best.has(k)&&best.get(k)!<=g)continue; best.set(k,g); const h=manhattan(p,goal); open.push({position:p,timeStep:t,g,h,f:g+h,parent:n});}
 }
 return {kind:'no-route',reason:'NO_SAFE_ROUTE_WITHIN_HORIZON'};
}
