export const THEMES = [
  "Anxiety & overthinking",
  "Burnout & perfectionism",
  "Relationships & attachment",
  "Body image & self-esteem",
  "Identity, sexuality & gender",
  "Complex trauma, shame & grief",
  "Numbness & meaning-making",
  "Something else / not sure yet",
];

export const SEEK = ["Individual therapy", "Couples therapy", "Workshop or training", "Not sure yet"];

export const PATTERNS = {
  coherent: {
    key: "coherent",
    label: "Coherent 5·5",
    desc: "Five seconds in, five seconds out. About six breaths a minute — the default, and a good place to start.",
    phases: [
      ["Breathe in", 5, 0.62, 1],
      ["Breathe out", 5, 1, 0.62],
    ],
  },
  box: {
    key: "box",
    label: "Box 4·4·4·4",
    desc: "In for four, hold for four, out for four, hold for four. Steadying when your mind is racing.",
    phases: [
      ["Breathe in", 4, 0.62, 1],
      ["Hold", 4, 1, 1],
      ["Breathe out", 4, 1, 0.62],
      ["Hold", 4, 0.62, 0.62],
    ],
  },
  "478": {
    key: "478",
    label: "4·7·8",
    desc: "In for four, hold for seven, a long eight-second exhale. Often used to settle before sleep.",
    phases: [
      ["Breathe in", 4, 0.62, 1],
      ["Hold", 7, 1, 1],
      ["Long exhale", 8, 1, 0.6],
    ],
  },
  sigh: {
    key: "sigh",
    label: "Physiological sigh",
    desc: "A full breath in, a small top-up, then a long exhale. The body's own reset.",
    phases: [
      ["Breathe in", 2, 0.6, 0.9],
      ["Top up", 1, 0.9, 1],
      ["Long exhale", 6, 1, 0.58],
      ["Rest", 1, 0.58, 0.6],
    ],
  },
};

export const PATTERN_KEYS = ["coherent", "box", "478", "sigh"];

export const CARDS = [
  { step: "Five", title: "Five things you can see", body: "Look slowly around you and name five. A corner of the ceiling, the colour of a wall, your own hands. No need to say them out loud." },
  { step: "Four", title: "Four things you can feel", body: "The chair beneath you, fabric against your skin, the temperature of the air, your feet on the floor." },
  { step: "Three", title: "Three things you can hear", body: "Traffic, a fan, your own breathing. Let sounds arrive without deciding whether you like them." },
  { step: "Two", title: "Two things you can smell", body: "Or two smells you like, if there's nothing to notice right now. Memory counts." },
  { step: "One", title: "One thing you can taste", body: "Tea, water, the inside of your own mouth. Then take one more slow breath, and come back when you're ready." },
];

export const ROOMS = [
  { key: "scatter", num: "01", title: "Scattered → Calm", blurb: "Scroll slowly and watch an overloaded page settle into order." },
  { key: "breath", num: "02", title: "Breathe with the light", blurb: "A ring that grows and softens with four breathing patterns." },
  { key: "smoke", num: "03", title: "Clear the mist", blurb: "Move slowly through cool fog to uncover the warmth beneath." },
  { key: "bilateral", num: "04", title: "Follow the light", blurb: "A soft orb drifting side to side, with an optional tap cue." },
  { key: "anchor", num: "05", title: "Press and hold", blurb: "Warmth that grows only while you stay, and fades slowly." },
  { key: "senses", num: "06", title: "5 · 4 · 3 · 2 · 1", blurb: "Come back to the room through each of your senses." },
];

export const ROOM_ORDER = ["hub", "scatter", "breath", "smoke", "bilateral", "anchor", "senses"];
export const NEXT_ROOM = { scatter: "breath", breath: "smoke", smoke: "bilateral", bilateral: "anchor", anchor: "senses", senses: "hub" };
export const NEXT_LABEL = {
  scatter: "Next · Breathe with the light",
  breath: "Next · Clear the mist",
  smoke: "Next · Follow the light",
  bilateral: "Next · Press and hold",
  anchor: "Next · 5 · 4 · 3 · 2 · 1",
  senses: "Next · Back to the sanctuary",
};
