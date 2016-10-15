import * as React from 'react';
import * as R from 'ramda';
import Cell from './cell';

const createCellNode = R.curry(
  (size, rowIndex, colIndex) => (
    <Cell
      key={`cell-${rowIndex}-${colIndex}`}
      length={`calc(40vw / ${size})`}
      mark="O"
      bgColor="#fff"
    />
  )
);

const createRowNode = R.curry(
  (size, rowIndex) => (
    <div
        key={`row-${rowIndex}`}
        style={{
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          border: 'none',
        }}>
      {R.map(createCellNode(size, rowIndex), R.range(0, size))}
    </div>
  )
);

export default function Board(props) {
  const { size } = props;

  return (
    <div
        className="board-container"
        style={{
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          border: '1px solid #555',
          display: 'inline-block',
          backgroundColor: '#f00',
        }}>
      {R.map(createRowNode(size), R.range(0, size))}
    </div>
  );
}

Board.propTypes = {
  size: React.PropTypes.number.isRequired,
};

Board.defaultProps = {
};
