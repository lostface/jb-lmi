export const randomIntBetween = (min, max) =>
  Math.floor(
    Math.random() * (max - min)
  ) + min;
