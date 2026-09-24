// app/components/faq/faqGradients.ts
//
// Ombré gradients for the FAQ boxes (horizontal version of the Process
// cards), reusing the same colour families. Boxes cycle through the sets in order.
// No two neighbouring boxes share a set, and the cycle repeats after the
// last set (last set != first set, so the seam is clean too).

type Layer = {
  x: number;
  y: number;
  color: string;
  opacity: number;
  w?: number;
  h?: number;
  fade?: number;
};

const BASE = "#421C2A";

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// The layer data below was designed for tall vertical Process cards
// (colour travels top -> bottom). FAQ boxes are wide horizontal bars, so we
// rotate every layer 90 degrees: x/y swap and the ellipse width/height swap.
// The colour now travels left -> right along the bar.
function buildOmbre(layers: Layer[], base: string = BASE): string {
  const radials = layers
    .map((l) => {
      const w = l.w ?? 140;
      const h = l.h ?? 55;
      const fade = l.fade ?? 72;
      return `radial-gradient(ellipse ${h}% ${w}% at ${l.y}% ${l.x}%, rgba(${hexToRgb(
        l.color,
      )}, ${l.opacity}) 0%, transparent ${fade}%)`;
    })
    .join(", ");
  return `${radials}, ${base}`;
}

const familyA: Layer[] = [
  { x: 50, y: 6, color: "#776B67", opacity: 0.68, w: 150, h: 34, fade: 70 },
  { x: 46, y: 27, color: "#97794F", opacity: 0.72, w: 145, h: 42, fade: 70 },
  { x: 54, y: 47, color: "#88693D", opacity: 0.6, w: 150, h: 44, fade: 72 },
  { x: 50, y: 68, color: "#654E2E", opacity: 0.62, w: 150, h: 42, fade: 74 },
  { x: 50, y: 88, color: "#563632", opacity: 0.65, w: 150, h: 36, fade: 70 },
  { x: 50, y: 102, color: "#4F2835", opacity: 0.8, w: 160, h: 40, fade: 62 },
];

const familyB: Layer[] = [
  { x: 50, y: 8, color: "#896441", opacity: 0.68, w: 150, h: 34, fade: 70 },
  { x: 44, y: 28, color: "#6E483B", opacity: 0.58, w: 145, h: 40, fade: 72 },
  { x: 52, y: 50, color: "#4A2333", opacity: 0.72, w: 155, h: 46, fade: 70 },
  { x: 48, y: 70, color: "#6D4C3A", opacity: 0.55, w: 150, h: 42, fade: 74 },
  { x: 50, y: 86, color: "#78614D", opacity: 0.5, w: 150, h: 36, fade: 74 },
  { x: 50, y: 102, color: "#736A67", opacity: 0.6, w: 160, h: 36, fade: 66 },
];

const familyB2: Layer[] = [
  { x: 50, y: 8, color: "#896441", opacity: 0.68, w: 150, h: 34, fade: 70 },
  { x: 46, y: 30, color: "#6F483C", opacity: 0.55, w: 145, h: 40, fade: 72 },
  { x: 52, y: 50, color: "#7A6670", opacity: 0.6, w: 155, h: 46, fade: 72 },
  { x: 48, y: 70, color: "#6E4C3A", opacity: 0.55, w: 150, h: 42, fade: 74 },
  { x: 50, y: 86, color: "#78614D", opacity: 0.5, w: 150, h: 36, fade: 74 },
  { x: 50, y: 102, color: "#716967", opacity: 0.58, w: 160, h: 36, fade: 66 },
];

const familyC: Layer[] = [
  { x: 48, y: 6, color: "#695D61", opacity: 0.62, w: 150, h: 32, fade: 70 },
  { x: 54, y: 24, color: "#8C8788", opacity: 0.5, w: 130, h: 30, fade: 68 },
  { x: 50, y: 48, color: "#563332", opacity: 0.68, w: 155, h: 46, fade: 72 },
  { x: 46, y: 68, color: "#745A35", opacity: 0.58, w: 150, h: 42, fade: 74 },
  { x: 50, y: 86, color: "#9A7846", opacity: 0.65, w: 150, h: 38, fade: 72 },
  { x: 50, y: 102, color: "#8D6E43", opacity: 0.68, w: 160, h: 34, fade: 64 },
];

const familyC2: Layer[] = [
  { x: 48, y: 6, color: "#685C60", opacity: 0.6, w: 150, h: 32, fade: 70 },
  { x: 54, y: 26, color: "#573845", opacity: 0.55, w: 140, h: 34, fade: 70 },
  { x: 50, y: 48, color: "#6B4D4C", opacity: 0.55, w: 150, h: 44, fade: 72 },
  { x: 46, y: 68, color: "#735935", opacity: 0.58, w: 150, h: 42, fade: 74 },
  { x: 50, y: 86, color: "#9B7948", opacity: 0.68, w: 150, h: 38, fade: 72 },
  { x: 50, y: 102, color: "#8D6E45", opacity: 0.7, w: 160, h: 34, fade: 64 },
];

const familyD: Layer[] = [
  { x: 50, y: 6, color: "#77543C", opacity: 0.62, w: 150, h: 32, fade: 70 },
  { x: 46, y: 24, color: "#745637", opacity: 0.5, w: 145, h: 34, fade: 70 },
  { x: 54, y: 42, color: "#5E442E", opacity: 0.55, w: 150, h: 38, fade: 72 },
  { x: 50, y: 58, color: "#4D2732", opacity: 0.7, w: 155, h: 44, fade: 70 },
  { x: 48, y: 78, color: "#5B444E", opacity: 0.55, w: 150, h: 40, fade: 74 },
  { x: 50, y: 100, color: "#6B6366", opacity: 0.55, w: 160, h: 34, fade: 66 },
];

const familyD2: Layer[] = [
  { x: 50, y: 6, color: "#77543B", opacity: 0.62, w: 150, h: 32, fade: 70 },
  { x: 46, y: 24, color: "#745638", opacity: 0.5, w: 145, h: 34, fade: 70 },
  { x: 54, y: 42, color: "#5E442F", opacity: 0.55, w: 150, h: 38, fade: 72 },
  { x: 50, y: 58, color: "#4C2632", opacity: 0.7, w: 155, h: 44, fade: 70 },
  { x: 48, y: 78, color: "#5C464F", opacity: 0.55, w: 150, h: 40, fade: 74 },
  { x: 50, y: 100, color: "#6B6367", opacity: 0.55, w: 160, h: 34, fade: 66 },
];

const cardFiveWide: Layer[] = [
  { x: 30, y: 14, color: "#6F4C3A", opacity: 0.55, w: 90, h: 46, fade: 72 },
  { x: 72, y: 10, color: "#6F4C3A", opacity: 0.5, w: 85, h: 42, fade: 74 },
  { x: 50, y: 45, color: "#45242D", opacity: 0.75, w: 130, h: 62, fade: 70 },
  { x: 40, y: 45, color: "#4A2B2F", opacity: 0.5, w: 90, h: 48, fade: 74 },
  { x: 50, y: 72, color: "#6C4D39", opacity: 0.5, w: 110, h: 40, fade: 74 },
  { x: 50, y: 96, color: "#5F493C", opacity: 0.55, w: 130, h: 34, fade: 68 },
  { x: 50, y: 104, color: "#453A3A", opacity: 0.5, w: 140, h: 30, fade: 64 },
];

// Order matters: neighbours are always different, and the last set differs
// from the first so the repeat has no visible seam.
const faqLayerSets: Layer[][] = [
  familyA,
  familyB,
  familyC,
  familyD,
  cardFiveWide,
  familyB2,
  familyC2,
  familyD2,
];

const faqGradients = faqLayerSets.map((layers) => buildOmbre(layers));

export function getFaqGradient(index: number): string {
  return faqGradients[index % faqGradients.length];
}