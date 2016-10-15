import * as React from 'react';
import * as R from 'ramda';
import { BOARD_SIZE, CELL_BG_COLOR_DEFAULT, CELL_MARK_DEFAULT } from '../config';
import { Board } from '../components';

const getDefaultBoardData = boardSize =>
  R.map(
    index => ({
      id: index,
      mark: CELL_MARK_DEFAULT,
      bgColor: CELL_BG_COLOR_DEFAULT,
    }),
    R.range(0, boardSize * boardSize)
  );

export default React.createClass({
  render() {
    const { boardData } = this.state;

    return (
      <div
          className="app-container"
          style={{
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
            border: 'none',
          }}>
        <Board size={BOARD_SIZE} data={boardData} onPlaceMarkTrigger={this.handlePlaceMarkTrigger} />
      </div>
    );
  },

  getInitialState() {
    return {
      boardData: getDefaultBoardData(BOARD_SIZE),
    };
  },

  handlePlaceMarkTrigger(cellId) {
    // TODO
  },
});
