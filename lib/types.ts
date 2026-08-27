export type Confidence = "high" | "medium" | "low";

export type Layer = {
  layer: string;
  role: string;
  marvel: string;
};

export type Material = {
  material: string;
  why: string;
};

export type CuriosityThread = {
  label: string;
  question: string;
  answer: string;
};

export type Story = {
  name: string;
  hook: string;
  confidence: Confidence;
  layers: Layer[];
  materials: Material[];
  the_marvel: string;
  history: string;
  look_closer: string;
  curiosity?: CuriosityThread[];
};

export type DemoEntry = {
  id: string;
  image: string;
  sketch?: string;
  story: Story;
};

export type ShelfItem = {
  id: string;
  name: string;
  hook: string;
  imageDataUrl?: string;
  publicId?: string;
  savedAt: string;
};

export type PublicScan = {
  id: string;
  created_at: string;
  name: string;
  story: Story;
  image_path: string;
  sketch_path: string | null;
  hidden: boolean;
  image_url?: string;
  sketch_url?: string | null;
};
