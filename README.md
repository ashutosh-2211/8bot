# 8bot

A framework-agnostic library for composing 8-bit pixel objects — characters,
robots, props, and geometric primitives — for webapps, web games, or
anywhere else.

## Install

```bash
npm install 8bot
```

## Use a built-in object

```ts
import { createHuman, randomHuman } from "8bot/catalog";
import { drawToCanvas } from "8bot/canvas";

const human = createHuman({ palette: { outfit: "#ff5533" } });
const anyHuman = randomHuman(); // random parts + palette
const repeatableHuman = randomHuman(42); // same seed -> same human

const ctx = (document.getElementById("scene") as HTMLCanvasElement).getContext("2d")!;
drawToCanvas(ctx, human, { pixelSize: 8 });
```

Or render to SVG instead:

```ts
import { toSvgString } from "8bot/svg";

document.body.innerHTML = toSvgString(human, { pixelSize: 8 });
```

## Built-in catalog

| Object | Import | Limbs |
|---|---|---|
| Human | `createHuman`, `randomHuman` | 2 arms, 2 legs |
| Elephant | `createElephant`, `randomElephant` | 4 legs |
| Tree | `createTree`, `randomTree` | none (static) |
| Octopod robot | `createOctopod`, `randomOctopod` | 8 legs |
| Tetrapod robot | `createTetrapod`, `randomTetrapod` | 4 legs |
| Flying bot | `createFlyingBot`, `randomFlyingBot` | 2 thrusters |
| Uni-eyed UFO | `createUfo`, `randomUfo` | none (static) |
| Cube / Oblongoid / Sphere | `createCube`, `createOblongoid`, `createSphere` (+ `randomX`) | n/a |

## Animating limbs (walk cycle)

Any object with limb slots (legs, thrusters) can be posed generically with
`walkCycle` — no per-object animation code needed. Pass the resulting pose
back into `createX`/`compose` each frame:

```ts
import { createOctopod, octopodDefinition } from "8bot/catalog";
import { walkCycle } from "8bot/core";
import { drawToCanvas } from "8bot/canvas";

function renderFrame(ctx: CanvasRenderingContext2D, t: number) {
  const pose = walkCycle(octopodDefinition, t);
  const octopod = createOctopod({ pose });
  drawToCanvas(ctx, octopod, { pixelSize: 8 });
}
```

In React, drive `t` from `requestAnimationFrame`:

```tsx
function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const ctx = canvasRef.current!.getContext("2d")!;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      renderFrame(ctx, (now - start) / 200);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} width={64} height={56} />;
}
```

## Positioning and interaction

8bot doesn't touch the DOM or track world position — it gives you the
object's bounds at whatever position you tell it, so your app can compare
against anything else on the page (e.g. a button):

```ts
import { getBounds, intersects } from "8bot/core";

const robotBounds = getBounds(octopod, { x: robotX, y: robotY }, 8);
const buttonRect = buttonEl.getBoundingClientRect();
const buttonBounds = { x: buttonRect.x, y: buttonRect.y, width: buttonRect.width, height: buttonRect.height };

if (intersects(robotBounds, buttonBounds)) {
  // the robot has "reached" the button — trigger whatever your app needs
}
```

## Build a custom object

Custom objects use the same primitives the catalog is built from —
`8bot/core` is not a wrapper, it's the actual public API:

```ts
import { compose, type ObjectDefinition } from "8bot/core";

const palaceDefinition: ObjectDefinition = {
  name: "palace",
  width: 10,
  height: 10,
  slots: [
    {
      name: "wall",
      position: { x: 0, y: 0 },
      variants: [{ id: "default", anchor: { x: 0, y: 0 }, grid: [["stone"]] }],
    },
  ],
  defaultPalette: { stone: "#aaaaaa" },
  allowedRegionTags: ["stone"],
};

const palace = compose(palaceDefinition, {}, { stone: "#ffcc88" });
```

## Isometric (2.5D) rendering

The same composed object renders flat or isometric — pass `mode: "isometric"`
to either renderer; parts with a higher `layer` are drawn projected further
up and to the right:

```ts
drawToCanvas(ctx, human, { mode: "isometric", pixelSize: 8 });
```

## Contributing a new catalog object

Add a folder under `src/catalog/<name>/` with `parts.ts`, `definition.ts`,
and `index.ts` (see `src/catalog/tree/` for the smallest example), then
export it from `src/catalog/index.ts`. Mark any leg/thruster/arm slots
`role: "limb"` to get `walkCycle` support for free. No core code changes
needed.

## Design spec

See `docs/superpowers/specs/2026-07-25-8bot-design.md` for the full design.
