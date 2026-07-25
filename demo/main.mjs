import { spriteDefinition } from "/dist/catalog/index.mjs";
import { compose, walkCycle } from "/dist/core/index.mjs";
import { drawToCanvas } from "/dist/canvas/index.mjs";

const CELL = 10; // px per pixel-art cell

// "move" here is entirely a demo concern: it just changes where we
// ctx.translate() to before calling drawToCanvas each frame. Limb motion
// (walkCycle) is the only animation the library itself provides.
const SUBJECTS = [
  { subject: "mask", label: "mask · abstract", move: "bounceXY" },
  { subject: "human", label: "human · walk cycle", move: "patrolX", limbs: true },
  { subject: "animal", label: "animal · walk cycle", move: "patrolX", limbs: true },
  { subject: "bird", label: "bird · wing flap + flight", move: "flyXY", limbs: true },
  { subject: "cloud", label: "cloud · drift", move: "driftX" },
  { subject: "hills", label: "hills · static backdrop", move: "none" },
];

const grid = document.getElementById("grid");
const cards = SUBJECTS.map(buildCard);

document.getElementById("reseed").addEventListener("click", () => {
  cards.forEach((card) => card.reseed());
});

function buildCard(cfg) {
  const card = document.createElement("div");
  card.className = "card";
  const canvas = document.createElement("canvas");
  card.appendChild(canvas);
  const label = document.createElement("div");
  label.className = "label";
  label.innerHTML = `<span>${cfg.label}</span><b></b>`;
  card.appendChild(label);
  grid.appendChild(card);

  const ctx = canvas.getContext("2d");
  const seedLabel = label.querySelector("b");
  let def;
  let marginX = 0;
  let marginY = 0;
  let t = 0;
  let travelT = Math.random() * 1000;

  function reseed() {
    const seed = Math.floor(Math.random() * 1e6);
    def = spriteDefinition({ subject: cfg.subject, seed });
    seedLabel.textContent = "seed " + seed;

    marginX = cfg.move === "none" ? 0 : Math.round(def.width * 0.6);
    marginY = cfg.move === "bounceXY" || cfg.move === "flyXY" ? Math.round(def.height * 0.5) : 0;
    canvas.width = (def.width + marginX) * CELL;
    canvas.height = (def.height + marginY) * CELL;
  }
  reseed();

  function frame() {
    t += 0.08;
    travelT += 0.015;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pose = cfg.limbs ? walkCycle(def, t) : {};
    const composed = compose(def, {}, {}, pose);

    let dx = marginX / 2;
    let dy = marginY / 2;
    if (cfg.move === "patrolX") {
      dx = marginX / 2 + Math.sin(travelT) * (marginX / 2);
    } else if (cfg.move === "driftX") {
      dx = ((travelT * 6) % (marginX + def.width)) - def.width / 2;
    } else if (cfg.move === "bounceXY") {
      dx = marginX / 2 + Math.sin(travelT * 1.3) * (marginX / 2);
      dy = marginY / 2 + Math.sin(travelT * 0.9) * (marginY / 2);
    } else if (cfg.move === "flyXY") {
      dx = marginX / 2 + Math.sin(travelT) * (marginX / 2);
      dy = marginY / 2 + Math.sin(travelT * 2.2) * (marginY / 2.5);
    }

    ctx.save();
    ctx.translate(Math.round(dx) * CELL, Math.round(dy) * CELL);
    drawToCanvas(ctx, composed, { pixelSize: CELL });
    ctx.restore();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { reseed };
}
