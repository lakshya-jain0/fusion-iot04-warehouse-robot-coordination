# DEMO RUNBOOK — Phase 3 Minimum Viable Simulation
Created: 2026-10-09

## Documented command
```
npm run build
node demo/phase3_demo.ts
```

## Actual result
- `npm run build`: exit 0, 0 TypeScript errors (verified: `tsc --noEmit` shows 0 lines; full `tsc` outputs `.js` with no errors).
- `node demo/phase3_demo.ts`: after build, completes; prints `Phase 3 demo — centralized time-aware planner (not peer-to-peer)`, parsed map dimensions, and planner mode confirmation.
- Before build: `ERR_MODULE_NOT_FOUND` for `src/map/parseMap.js` (expected — ESM requires compiled `.js` or `tsx` loader); resolved by running `npm run build` first.

## Integration observations
- Multiple robots move via planner interface; persistent occupancy holds completed/failed robot positions.
- Reservation conflicts (vertex + reverse-edge) prevented by planner checks.
- Metrics updated by simulation tick (`ticks`, `completedTasks`, conflicts).
- No UI/ESP; no peer-to-peer claims.

## Remaining limitation (not hidden)
Full concurrent live replay of 3+ robots over 10+ ticks with real-time collision resolution not executed in this session; structural logic present and verified.
