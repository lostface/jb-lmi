import * as R from 'ramda';

export const randomIntBetween = (min, max) =>
  Math.floor(
    Math.random() * (max - min)
  ) + min;

export const getFlatMatrixRows = R.splitEvery;

export const getFlatMatrixCols = (size, data) => {
  // TODO simpler solution?
  const cols = R.compose(
    R.map(() => []),
    R.range
  )(0, size);

  R.reduce((acc, cell) => {
    acc[cell.id % size].push(cell);
    return acc;
  })(cols, data);

  return cols;
};
