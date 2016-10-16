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
      isUsersTurn: true,
    };
  },

  placeMark(index, mark) {
    const boardData = R.adjust(
      R.assoc('mark', mark),
      index,
      this.state.boardData
    );

    this.setState({ boardData });
  },

  userIsNext() {
    this.setState({ isUsersTurn: true });
  },

  computerIsNext() {
    this.setState({ isUsersTurn: false });
  },

  isEmptyCell(cellId) {
    // INFO cellId is same as the index of the cell in boardData, so no need for extra find
    return this.state.boardData[cellId].mark === CELL_MARK_DEFAULT;
  },

  handlePlaceMarkTrigger(cellId) {
    // TODO ramdaify
    const { isUsersTurn } = this.state;
    // INFO cellId is same as the index of the cell in boardData, so no need for extra find
    if (isUsersTurn && this.isEmptyCell(cellId)) {
      this.placeMark(cellId, 'X');
      this.computerIsNext();
    }
  },
});
