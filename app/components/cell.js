import * as React from 'react';

export default function Cell(props) {
  const { id, length, mark, bgColor } = props;

  return (
    <div
        id={`cell-${id}`}
        className="cell-container"
        style={{
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          display: 'inline-block',
          width: length,
          height: length,
          backgroundColor: bgColor,
          border: '1px solid #555',
          verticalAlign: 'middle',
          lineHeight: length,
          textAlign: 'center',
          textTransform: 'uppercase',
          fontSize: length,
        }}>
      {mark}
    </div>
  );
}

Cell.propTypes = {
  id: React.PropTypes.number.isRequired,
  length: React.PropTypes.string.isRequired,
  mark: React.PropTypes.string.isRequired,
  bgColor: React.PropTypes.string.isRequired,
};

Cell.defaultProps = {
  mark: '',
  bgColor: '#fff',
};
