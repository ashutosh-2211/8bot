export type RegionTag = string;
export type Pixel = RegionTag | null;
export type PixelGrid = Pixel[][];

export interface Part {
  id: string;
  grid: PixelGrid;
  anchor: { x: number; y: number };
  layer?: number;
}

export interface Palette {
  [regionTag: string]: string;
}

export type SlotRole = "limb" | "body" | "accessory";

export interface SlotDefinition {
  name: string;
  variants: Part[];
  position: { x: number; y: number };
  layer?: number;
  role?: SlotRole;
}

export interface ObjectDefinition {
  name: string;
  width: number;
  height: number;
  slots: SlotDefinition[];
  defaultPalette: Palette;
  allowedRegionTags: string[];
  paletteOptions?: Array<Partial<Palette>>;
}

export type ShapeKind = "cube" | "oblongoid" | "sphere";

export interface ShapeDefinition {
  name: string;
  kind: ShapeKind;
  width: number;
  height: number;
  defaultColor: string;
}

export interface ComposedPixel {
  x: number;
  y: number;
  color: string;
  layer: number;
}

export interface ComposedObject {
  name: string;
  width: number;
  height: number;
  pixels: ComposedPixel[];
}

export type Pose = Record<string, { dx?: number; dy?: number }>;

export interface Position {
  x: number;
  y: number;
}

export interface Bounds extends Position {
  width: number;
  height: number;
}
