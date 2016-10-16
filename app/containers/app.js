import * as React from 'react';
import * as R from 'ramda';
import { randomIntBetween } from '../common';
import { BOARD_SIZE, CELL_BG_COLOR_DEFAULT, CELL_MARK_DEFAULT, CELL_MARK_USER, CELL_MARK_COMP, COMPUTER_SPEED } from '../config';
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

const isEmptyCell = R.propEq('mark', CELL_MARK_DEFAULT);

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
      usersTurn: true,
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
    this.setState({ usersTurn: true });
  },

  computerIsNext() {
    this.setState({ usersTurn: false });
  },

  getCellById(cellId) {
    // INFO cellId is same as the index of the cell in boardData, so no need for extra find
    return this.state.boardData[cellId];
  },

  getEmptyCells() {
    return R.filter(isEmptyCell, this.state.boardData);
  },

  userMarks(cellId) {
    this.placeMark(cellId, CELL_MARK_USER);
  },

  computerMarks() {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length == 0) {
      return;
    }

    const index = randomIntBetween(0, emptyCells.length);
    const targetCell = emptyCells[index];
    this.placeMark(targetCell.id, CELL_MARK_COMP);
  },

  triggerComputerPlay() {
    setTimeout(() => {
      this.computerMarks();
      this.userIsNext();
    }, COMPUTER_SPEED);
  },

  handlePlaceMarkTrigger(cellId) {
    // TODO ramdaify
    const { usersTurn } = this.state;
    const cell = this.getCellById(cellId);

    if (usersTurn && isEmptyCell(cell)) {
      this.userMarks(cellId);
      this.computerIsNext();
      this.triggerComputerPlay();
    }
  },
});
