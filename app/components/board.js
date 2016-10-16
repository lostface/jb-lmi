import * as React from 'react';
import * as R from 'ramda';
import Row from './row';

const createRowNodes = (boardSize, data) => (
  R.compose(
    R.map(
      rowData => <Row key={rowData.id} size={rowData.boardSize} cells={rowData.cells} />
    ),
    R.zipWith(
      (index, cells) => ({ id: index, boardSize, cells }),
      R.range(0, boardSize * boardSize)
    ),
    R.splitEvery,
  )(boardSize, data)
);

export default React.createClass({
  propTypes: {
    size: React.PropTypes.number.isRequired,
    data: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        mark: React.PropTypes.string.isRequired,
        bgColor: React.PropTypes.string.isRequired,
      })
    ),
    onPlaceMarkTrigger: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onPlaceMarkTrigger: () => {},
    };
  },

  render() {
    const { size, data } = this.props;

    return (
      <div
          onClick={this.handleClick}
          className="board-container"
          style={{
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
            border: '1px solid #555',
            display: 'inline-block',
            backgroundColor: '#f00',
          }}>
        {createRowNodes(size, data)}
      </div>
    );
  },

  handleClick(event) {
    const { onPlaceMarkTrigger } = this.props;

    // INFO event target could be only our cell container so no need for filtering for now
    const targetId = event.target.id;

    // 'cell-7' > '7'
    const cellId = Number(targetId.match(/\d+$/)[0]);

    onPlaceMarkTrigger(cellId);
  },
});
