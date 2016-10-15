import * as React from 'react';
import * as R from 'ramda';
import Cell from './cell';

const createCellNode = cellData => {
  const { rowSize, cell } = cellData;

  return (
    <Cell
      key={cell.id}
      id={cell.id}
      length={`calc(40vw / ${rowSize})`}
      mark={cell.mark}
      bgColor={cell.bgColor}
    />
  );
};

const createCellNodes = (rowSize, cells) => (
  R.compose(
    R.map(createCellNode),
    R.map(cell => ({ rowSize, cell }))
  )(cells)
);

export default function Row(props) {
  const { size, cells } = props;

  return (
    <div
        className="row-container"
        style={{
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          border: 'none',
        }}>
      {createCellNodes(size, cells)}
    </div>
  );
}

Row.propTypes = {
  size: React.PropTypes.number.isRequired,
  cells: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      mark: React.PropTypes.string.isRequired,
      bgColor: React.PropTypes.string.isRequired,
    })
  ),
};
