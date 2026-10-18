export const rand = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};

export const mulberry32 = (a: number) => {
  return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
};