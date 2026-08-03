export {
  BRANDS,
  img,
  stockFull,
  stockLimited,
  stockOos,
  upcomingAt,
  UPCOMING_DROP,
  type Badge,
  type Category,
  type Gender,
  type SeedProduct,
  type SeedVariant,
} from "./types";

export { CLASSICS } from "./classics";
export { DROPS } from "./drops";

import { CLASSICS } from "./classics";
import { DROPS } from "./drops";

if (CLASSICS.length !== 50) {
  throw new Error(`CLASSICS must be 50, got ${CLASSICS.length}`);
}
if (DROPS.length !== 50) {
  throw new Error(`DROPS must be 50, got ${DROPS.length}`);
}
