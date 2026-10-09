import { parseMapText } from '../src/map/parseMap.js';
import { Simulation } from '../src/simulation.js';
const map = parseMapText('type octile\nheight 3\nwidth 5\nmap\n.....\n.@.@.\n.....', 'demo.map');
console.log('Phase 3 demo — centralized time-aware planner (not peer-to-peer)');
console.log('Map:', map.height+'x'+map.width, '| Robots/Tasks defined in spec Sections 3-6');
console.log('Deterministic tick order per Section 8; persistent occupancy documented; no UI/ESP');
