import createLabeledBuffer from './utils/labeled-buffer';

export type BallBuffer = ReturnType<typeof BallBuffer>;
export const BallBuffer = createLabeledBuffer('ball', {
  power: 1,
  axis: 3,
  leg: 3,
  dt: 1,
  tilt: 9,
  swipe: 9,
  coord: 9,
});
