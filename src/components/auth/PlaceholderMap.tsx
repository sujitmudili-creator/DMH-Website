import { mapLabels } from "@/data/auth";

/** Map width × height in base units (mobile scale). Desktop draws it at 1.95×. */
export const MAP_W = 393;
export const MAP_H = 758;

// Figma "Map" frame (W1.13 / M1.12): blocks, park and white roads on map grey. Base coordinates.
const blocks = [
  [16, 20, 110, 90],
  [140, 20, 80, 60],
  [250, 30, 130, 70],
  [20, 250, 90, 120],
  [280, 250, 100, 80],
  [30, 520, 120, 90],
  [180, 560, 90, 60],
  [300, 470, 80, 130],
  [150, 250, 70, 50],
] as const;

// Road boxes: centre x, centre y, width, height, rotation.
const roads = [
  [207.5, 237.1, 500, 22, 6],
  [209.9, 420.9, 460, 14, -4],
  [182.6, 355.1, 14, 800, -8],
  [238.1, 359.4, 12, 800, 4],
] as const;

/**
 * Drawn stand-in for the map (no map SDK). Positioned by the parent; `hidden` shows the empty grey
 * map used while it loads (W20.17).
 */
export function PlaceholderMap({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden className="relative bg-map" style={{ width: MAP_W, height: MAP_H }}>
      {!hidden && (
        <>
          {blocks.map(([x, y, w, h], i) => (
            <span key={i} className="absolute rounded-md bg-map-block" style={{ left: x, top: y, width: w, height: h }} />
          ))}
          <span className="absolute rounded-xl bg-map-park" style={{ left: 150, top: 120, width: 110, height: 100 }} />
          {roads.map(([cx, cy, w, h, r], i) => (
            <span
              key={i}
              className="absolute bg-card"
              style={{ left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `rotate(${r}deg)` }}
            />
          ))}
          {mapLabels.map((l) => (
            <span key={l.text} className="absolute whitespace-nowrap text-b12 font-medium text-ink-2" style={{ left: l.x, top: l.y }}>
              {l.text}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
